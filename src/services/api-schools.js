import { fetchKoladaCity, isKoladaPayload } from "../../lib/kolada.js";

async function postJson(path, city) {
  try {
    const response = await fetch(`/api/${path}/${city}`, { method: "POST" });
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data?.data)) {
      return [null, new Error(data?.error || `Kunde inte hämta ${path}`)];
    }
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

export async function getKoladaSchool(city) {
  try {
    const response = await fetch(`/api/kolada/${city}`, {
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
    const { status, data } = await fetchKoladaCity(city);
    if (status < 400 && isKoladaPayload(data)) {
      return [data, null];
    }
    return [null, new Error(data?.error || "Kunde inte hämta skolstatistik")];
  } catch (err) {
    return [null, err];
  }
}

export const getUpperSchoolUnits = (city) => postJson("skolverket/upper-units", city);
export const getPreschoolUnits = (city) => postJson("skolverket/preschool-units", city);
export const getCompulsoryUnits = (city) => postJson("skolverket/compulsory-units", city);
export const getPreschoolStaff = (city) => postJson("skolverket/preschool-staff", city);
export const getUpperResults = (city) => postJson("skolverket/upper-results", city);
