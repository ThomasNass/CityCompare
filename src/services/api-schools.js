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
    const response = await fetch(`/api/kolada/${city}`);
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data?.values)) {
      return [null, new Error(data?.error || "Kunde inte hämta skolstatistik")];
    }
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

export const getUpperSchoolUnits = (city) => postJson("skolverket/upper-units", city);
export const getPreschoolUnits = (city) => postJson("skolverket/preschool-units", city);
export const getCompulsoryUnits = (city) => postJson("skolverket/compulsory-units", city);
