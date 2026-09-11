const LIST_URL = "https://gw.havochvatten.se/external-public/bathing-waters/v2/bathing-waters";
const HAV_HEADERS = {
  Accept: "application/json",
  "User-Agent": "MuniMatch/1.0 (https://github.com/ThomasNass/CityCompare)",
};

let cachedList = null;
let cachedAt = 0;
const LIST_TTL_MS = 24 * 60 * 60 * 1000;

function asList(data) {
  if (Array.isArray(data?.watersAndAdvisories)) return data.watersAndAdvisories;
  if (Array.isArray(data?.bathingWaters)) return data.bathingWaters;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data)) return data;
  return [];
}

function classificationOf(item) {
  const bathingWater = item?.bathingWater ?? item ?? {};
  const profile = item?.profile ?? bathingWater.profile ?? {};
  const values = [
    bathingWater.classificationIdText,
    bathingWater.classificationText,
    bathingWater.classification,
    profile.classificationIdText,
    profile.classificationText,
    profile.euClassification,
    profile.classification?.name,
    profile.classification?.idText,
  ];
  return values.find((value) => typeof value === "string" && value.trim()) ?? "";
}

function isExcellent(text) {
  const normalized = text.toLowerCase();
  return normalized.includes("utmärkt") || normalized.includes("utmarkt") || normalized.includes("excellent");
}

function municipalityOf(item) {
  const bathingWater = item?.bathingWater ?? item ?? {};
  return bathingWater.municipality ?? item?.municipality ?? {};
}

function matchesMunicipality(item, lauCode, cityName) {
  const municipality = municipalityOf(item);
  const id = String(municipality.id ?? municipality.code ?? municipality.nutsCode ?? "")
    .replace(/\D/g, "")
    .padStart(4, "0");
  if (id && id === String(lauCode).padStart(4, "0")) return true;
  const name = String(municipality.name ?? "").toLowerCase();
  return name !== "" && name === String(cityName ?? "").toLowerCase();
}

export async function fetchBathingWaters() {
  if (cachedList && Date.now() - cachedAt < LIST_TTL_MS) {
    return { status: 200, data: cachedList };
  }

  try {
    const response = await fetch(LIST_URL, {
      headers: HAV_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
      return { status: response.status || 502, data: data ?? { error: "HaV-anropet misslyckades" } };
    }
    const list = asList(data);
    cachedList = list;
    cachedAt = Date.now();
    return { status: 200, data: list };
  } catch (error) {
    return { status: 502, data: { error: error.message || "HaV-anropet misslyckades" } };
  }
}

export function summarizeBeaches(list, lauCode, cityName) {
  const matches = (Array.isArray(list) ? list : []).filter((item) => matchesMunicipality(item, lauCode, cityName));
  let classified = 0;
  let excellent = 0;
  for (const item of matches) {
    const text = classificationOf(item);
    if (!text) continue;
    classified += 1;
    if (isExcellent(text)) excellent += 1;
  }
  return {
    total: matches.length,
    classified,
    excellent,
    excellentShare: classified ? (excellent / classified) * 100 : null,
  };
}
