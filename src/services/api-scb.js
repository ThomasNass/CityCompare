async function postScb(path, city) {
  try {
    const response = await fetch(`/api/scb/${path}/${city}`, {
      method: "POST",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(data?.data)) {
      return [null, new Error(data?.error || `Kunde inte hämta ${path}`)];
    }
    return [data, null];
  } catch (err) {
    return [null, err];
  }
}

export const getElectionData = (city) => postScb("election", city);
export const getMuniElectionData = (city) => postScb("election-muni", city);
export const getRegionElectionData = (city) => postScb("election-region", city);
export const getHousePrices = (city) => postScb("houseprice", city);
export const getGenPopulation = (city) => postScb("pop", city);
export const getPopulationGrowth = (city) => postScb("growth", city);
export const getIncome = (city) => postScb("income", city);
export const getEducation = (city) => postScb("education", city);
export const getMunicipalTax = (city) => postScb("tax", city);
export const getGreenSpace = (city) => postScb("green", city);
