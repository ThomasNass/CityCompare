export const KOLADA_KPIS = {
  preschoolQualified: "N11808",
  preschoolChildrenPerStaff: "N11102",
  preschoolMunicipal: "N11061",
  preschoolIndependent: "N11060",
  compulsoryQualified: "N15813",
  compulsoryPupilsPerTeacher: "N15033",
  compulsoryMerit: "N15504",
  compulsoryEligible: "N15428",
  compulsoryMunicipalSchools: "N15750",
  compulsoryIndependentSchools: "N15751",
  upperQualified: "N17825",
  upperPupilsPerTeacher: "N17816",
  upperExam: "N17445",
  upperUniEligible: "N17473",
  upperUniAfter: "N18605",
  upperIndependentShare: "N17897",
  upperGradePoints: "N17701",
};

export const KOLADA_KPI_IDS = Object.values(KOLADA_KPIS);

export const SOCIETY_KPIS = {
  unemployment: "N02280",
  crimeViolence: "N07403",
  crimeVandalism: "U07452",
  crimeBurglary: "N07546",
  crimeTheft: "U07417",
  crimeTraffic: "N07548",
  safetyDarkOutdoors: "N00610",
  safetyBurglaryTheft: "N00623",
  safetyDisturbingTraffic: "N00624",
};

export const SOCIETY_KPI_IDS = Object.values(SOCIETY_KPIS);

const KOLADA_YEARS = Array.from({ length: 16 }, (_, index) => String(2010 + index)).join(",");

function koladaHeaders() {
  const headers = { Accept: "application/json" };
  if (typeof window === "undefined") {
    headers["User-Agent"] = "MuniMatch/1.0 (https://github.com/ThomasNass/CityCompare)";
  }
  return headers;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CARE_KPIS = {
  primaryCare3days: "N79173",
  specialist90days: "N79224",
};

export const CARE_KPI_IDS = Object.values(CARE_KPIS);

export function koladaCityUrl(city) {
  const municipality = String(city).padStart(4, "0");
  return `https://api.kolada.se/v3/data/kpi/${KOLADA_KPI_IDS.join(",")}/municipality/${municipality}/year/${KOLADA_YEARS}`;
}

export function koladaRegionCareUrl(regionId) {
  return `https://api.kolada.se/v3/data/kpi/${CARE_KPI_IDS.join(",")}/municipality/${regionId}/year/${KOLADA_YEARS}`;
}

export function koladaSocietyUrl(city) {
  const municipality = String(city).padStart(4, "0");
  return `https://api.kolada.se/v3/data/kpi/${SOCIETY_KPI_IDS.join(",")}/municipality/${municipality}/year/${KOLADA_YEARS}`;
}

export function isKoladaPayload(data) {
  return Array.isArray(data?.values) && data.values.length > 0;
}

export async function fetchKoladaData(startUrl, { retries = 1, timeoutMs = 8000 } = {}) {
  let lastStatus = 502;
  let lastBody = { error: "Kolada-anropet misslyckades" };

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const values = [];
      let next = startUrl;
      let incomplete = false;

      while (next) {
        const response = await fetch(next, {
          headers: koladaHeaders(),
          signal: AbortSignal.timeout(timeoutMs),
        });
        lastStatus = response.status;
        const data = await response.json().catch(() => null);
        lastBody = data ?? { error: "Kolada-anropet misslyckades" };
        const retryable = response.status === 429 || response.status >= 500 || !data;

        if (!response.ok || !data) {
          if (retryable && attempt < retries - 1) {
            incomplete = true;
            await sleep(300 * 2 ** attempt);
            break;
          }
          return { status: response.status || 502, data: lastBody };
        }

        values.push(...(data.values ?? []));
        next = data.next_url || null;
      }

      if (!incomplete) {
        if (!values.length) {
          return { status: 502, data: { error: "Kolada returnerade inga värden" } };
        }
        return { status: 200, data: { values } };
      }
    } catch (error) {
      lastStatus = 502;
      lastBody = { error: error.message || "Kolada-anropet misslyckades" };
      if (attempt < retries - 1) await sleep(300 * 2 ** attempt);
    }
  }

  return { status: lastStatus, data: lastBody };
}

export async function fetchKoladaCity(city, options) {
  return fetchKoladaData(koladaCityUrl(city), options);
}

export async function fetchKoladaRegionCare(regionId, options) {
  return fetchKoladaData(koladaRegionCareUrl(regionId), options);
}

export async function fetchKoladaSociety(city, options) {
  return fetchKoladaData(koladaSocietyUrl(city), options);
}
