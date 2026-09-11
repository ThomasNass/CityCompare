import { fetchKoladaRegionCare, fetchKoladaSociety, isKoladaPayload } from "../../lib/kolada.js";

async function getJson(path) {
  try {
    const response = await fetch(path, { signal: AbortSignal.timeout(12000) });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return [null, new Error(data?.error || `Kunde inte hämta ${path}`)];
    }
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

export async function getBeaches(lauCode, cityName) {
  const query = cityName ? `?name=${encodeURIComponent(cityName)}` : "";
  const [data, error] = await getJson(`/api/hav/${lauCode}${query}`);
  if (error || data?.total == null) return [null, error ?? new Error("Kunde inte hämta badplatser")];
  return [data, null];
}

export async function getAirQuality(lauCode, cityName) {
  const query = cityName ? `?name=${encodeURIComponent(cityName)}` : "";
  const [data] = await getJson(`/api/air/${lauCode}${query}`);
  return [data ?? { missing: true }, null];
}

export async function getRegionCare(regionId) {
  if (!regionId) return [null, new Error("Saknar region")];
  try {
    const response = await fetch(`/api/kolada/region/${regionId}`, {
      signal: AbortSignal.timeout(6000),
    });
    const data = await response.json().catch(() => null);
    if (response.ok && isKoladaPayload(data)) {
      return [data, null];
    }
  } catch {
    // Fall through to Kolada from the browser if the Vercel function times out.
  }

  try {
    const { status, data } = await fetchKoladaRegionCare(regionId);
    if (status < 400 && isKoladaPayload(data)) {
      return [data, null];
    }
    return [null, new Error(data?.error || "Kunde inte hämta vårdstatistik")];
  } catch (err) {
    return [null, err];
  }
}

export async function getKoladaSociety(city) {
  try {
    const response = await fetch(`/api/kolada/society/${city}`, {
      signal: AbortSignal.timeout(6000),
    });
    const data = await response.json().catch(() => null);
    if (response.ok && isKoladaPayload(data)) {
      return [data, null];
    }
  } catch {
    // Vercel Hobby cuts serverless functions off after ~10s. Fall through to Kolada.
  }

  try {
    const { status, data } = await fetchKoladaSociety(city);
    if (status < 400 && isKoladaPayload(data)) {
      return [data, null];
    }
    return [null, new Error(data?.error || "Kunde inte hämta brott- och arbetsmarknadsstatistik")];
  } catch (err) {
    return [null, err];
  }
}
