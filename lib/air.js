import STATIONS from "./air-stations.json" with { type: "json" };
import { regionFromLau } from "./regions.js";

const REST_URL = "https://datavardluft.smhi.se/52North/api/timeseries";
const MAX_AGE_MS = 48 * 60 * 60 * 1000;
const observationCache = new Map();
const OBS_TTL_MS = 20 * 60 * 1000;

function airHeaders() {
  const headers = { Accept: "application/json" };
  if (typeof window === "undefined") {
    headers["User-Agent"] = "MuniMatch/1.0 (https://github.com/ThomasNass/CityCompare)";
  }
  return headers;
}

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

function featureIdsForCity(cityName, limit) {
  return [...new Set(stationsForName(cityName).slice(0, limit).map((station) => String(station.id)))];
}

function pollutantFromSeries(series) {
  const id = String(series?.parameters?.phenomenon?.id ?? "");
  if (id === "8") return "no2";
  return "pm10";
}

function parseReading(series) {
  const last = series?.lastValue;
  const value = Number(last?.value);
  const timestamp = Number(last?.timestamp);
  if (!Number.isFinite(value) || !Number.isFinite(timestamp)) return null;
  if (Date.now() - timestamp > MAX_AGE_MS) return null;
  const station =
    series?.parameters?.feature?.label ?? series?.station?.properties?.label ?? series?.station?.label ?? null;
  return {
    value,
    observedAt: new Date(timestamp).toISOString(),
    pollutant: pollutantFromSeries(series),
    station,
    timestamp,
  };
}

function pickReading(readings, localNames) {
  const recent = readings.filter(Boolean);
  const local = recent.filter((reading) => localNames.has(reading.station));
  const pool = local.length ? local : recent;
  pool.sort((a, b) => {
    if (a.pollutant === "pm10" && b.pollutant !== "pm10") return -1;
    if (b.pollutant === "pm10" && a.pollutant !== "pm10") return 1;
    return b.timestamp - a.timestamp;
  });
  const best = pool[0];
  if (!best) return null;
  return { value: best.value, observedAt: best.observedAt, pollutant: best.pollutant, station: best.station };
}

async function fetchTimeseries(featureIds) {
  const ids = [...new Set(featureIds.map(String))].slice(0, 6);
  if (!ids.length) return [];
  const response = await fetch(`${REST_URL}?expanded=true&features=${ids.join(",")}`, {
    headers: airHeaders(),
    signal: AbortSignal.timeout(8500),
  });
  if (!response.ok) return [];
  const data = await response.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

export async function fetchAirQuality(lauCode, cityName) {
  const cacheKey = `${lauCode}:${cityName ?? ""}`;
  const cached = observationCache.get(cacheKey);
  if (cached && Date.now() - cached.at < OBS_TTL_MS) return cached.value;

  const localNames = new Set(stationsForName(cityName).map((station) => station.name));
  const featureIds = featureIdsForCity(cityName, 3);
  const county = regionFromLau(lauCode);
  const seatName = county?.seat?.name;
  if (seatName && seatName !== cityName) {
    featureIds.push(...featureIdsForCity(seatName, 2));
  }

  try {
    const series = await fetchTimeseries(featureIds);
    const picked = pickReading(series.map(parseReading), localNames);
    if (!picked) {
      return { missing: true };
    }

    const local = localNames.has(picked.station);
    const result = local
      ? { missing: false, fallback: false, ...picked }
      : {
          missing: false,
          fallback: true,
          fallbackName: seatName ?? picked.station,
          regionName: county?.name,
          ...picked,
        };
    observationCache.set(cacheKey, { at: Date.now(), value: result });
    return result;
  } catch {
    return { missing: true };
  }
}
