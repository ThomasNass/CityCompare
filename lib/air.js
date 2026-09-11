import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { regionFromLau } from "./regions.js";

const STATIONS = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "air-stations.json"), "utf8")
);

const SOS_URL = "https://datavardluft.smhi.se/52North/service";
const POLLUTANTS = {
  pm10: "http://dd.eionet.europa.eu/vocabulary/aq/pollutant/5",
  no2: "http://dd.eionet.europa.eu/vocabulary/aq/pollutant/8",
};

const observationCache = new Map();
const OBS_TTL_MS = 20 * 60 * 1000;

function stationsForName(cityName) {
  const needle = String(cityName ?? "").toLowerCase();
  if (!needle) return [];
  return STATIONS.filter((station) => {
    const name = station.name.toLowerCase();
    return name === needle || name.startsWith(`${needle} `);
  }).sort((a, b) => scoreStation(b, cityName) - scoreStation(a, cityName));
}

function scoreStation(station, cityName) {
  let score = station.pollutant === "pm10" ? 10 : 0;
  if (station.name === cityName) score += 5;
  if (/femman|bakgrund|stadshus|rådhus/i.test(station.name)) score += 3;
  if (/gata/i.test(station.name)) score -= 1;
  return score;
}

async function fetchLatestObservation(station) {
  const cached = observationCache.get(station.id);
  if (cached && Date.now() - cached.at < OBS_TTL_MS) return cached.value;

  const end = new Date();
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    service: "SOS",
    version: "2.0.0",
    request: "GetObservation",
    featureOfInterest: station.id,
    observedProperty: POLLUTANTS[station.pollutant] ?? POLLUTANTS.pm10,
    temporalFilter: `om:phenomenonTime,${start.toISOString()}/${end.toISOString()}`,
  });

  try {
    const response = await fetch(`${SOS_URL}?${params}`, {
      headers: { Accept: "application/json", "User-Agent": "MuniMatch/1.0" },
      signal: AbortSignal.timeout(6000),
    });
    const data = await response.json().catch(() => null);
    const observations = data?.observations ?? [];
    const last = observations.at(-1);
    const value = last?.result?.value;
    const time = Array.isArray(last?.phenomenonTime) ? last.phenomenonTime.at(-1) : last?.phenomenonTime;
    const parsed = Number.isFinite(Number(value))
      ? { value: Number(value), observedAt: time ?? null, pollutant: station.pollutant, station: station.name }
      : null;
    observationCache.set(station.id, { at: Date.now(), value: parsed });
    return parsed;
  } catch {
    observationCache.set(station.id, { at: Date.now(), value: null });
    return null;
  }
}

async function readingForCity(cityName) {
  const stations = stationsForName(cityName);
  for (const station of stations.slice(0, 2)) {
    const reading = await fetchLatestObservation(station);
    if (reading) return reading;
  }
  return null;
}

export async function fetchAirQuality(lauCode, cityName) {
  const local = await readingForCity(cityName);
  if (local) {
    return { missing: false, fallback: false, ...local };
  }

  const county = regionFromLau(lauCode);
  if (county?.seat?.name && county.seat.name !== cityName) {
    const seat = await readingForCity(county.seat.name);
    if (seat) {
      return {
        missing: false,
        fallback: true,
        fallbackName: county.seat.name,
        regionName: county.name,
        ...seat,
      };
    }
  }

  return { missing: true };
}
