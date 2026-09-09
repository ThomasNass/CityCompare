import { getJobListings, getTaxes, getJobListingsByField } from "./api-caller.js";
import {
  getGenPopulation,
  getIncome,
  getHousePrices,
  getElectionData,
  getMuniElectionData,
} from "./api-scb.js";

function yearFromKey(key) {
  return [...key].reverse().find((part) => /^\d{4}$/.test(part));
}

function partyName(code) {
  return code === "FP" ? "L" : code;
}

function mapElection(data, lauCode) {
  const byYear = {};
  for (const element of data.data) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    const party = partyName(element.key[1]);
    if (!byYear[year]) byYear[year] = { parties: [], share: [] };
    byYear[year].parties.push(party);
    byYear[year].share.push(parseFloat(element.values[0]));
  }
  const years = Object.keys(byYear).sort();
  const latest = byYear[years.at(-1)];
  return {
    year: years.at(-1),
    years,
    parties: latest?.parties ?? [],
    share: latest?.share ?? [],
    byYear,
  };
}

function mapPopulationByGender(city, populationByGender) {
  const byYear = {};
  for (const element of populationByGender.data) {
    if (element.key[0] !== city.lauCode) continue;
    const year = yearFromKey(element.key);
    if (!byYear[year]) byYear[year] = { men: 0, fem: 0 };
    const count = parseInt(element.values[0], 10);
    if (element.key[1] == 1) byYear[year].men = count;
    else byYear[year].fem = count;
  }
  const years = Object.keys(byYear).sort();
  const latest = byYear[years.at(-1)] ?? { men: 0, fem: 0 };
  city.population = {
    year: years.at(-1),
    men: latest.men,
    fem: latest.fem,
    total: latest.men + latest.fem,
    growth: {
      year: years,
      population: years.map((year) => byYear[year].men + byYear[year].fem),
    },
    genderSeries: {
      year: years,
      men: years.map((year) => byYear[year].men),
      fem: years.map((year) => byYear[year].fem),
    },
  };
}

function mapHousePrices(data, lauCode) {
  const years = [];
  const values = [];
  for (const element of data.data) {
    if (element.key[0] !== lauCode) continue;
    years.push(yearFromKey(element.key));
    values.push(parseInt(element.values[0], 10));
  }
  return {
    housePriceYear: years.at(-1),
    housePrice: values.at(-1),
    housePriceSeries: { year: years, values },
  };
}

function mapIncome(data, lauCode) {
  const years = [];
  const average = [];
  const median = [];
  for (const element of data.data) {
    if (element.key[0] !== lauCode) continue;
    years.push(yearFromKey(element.key));
    average.push(Number(element.values[0]));
    median.push(Number(element.values[1]));
  }
  return {
    year: years.at(-1),
    average: average.at(-1),
    median: median.at(-1),
    series: { year: years, average, median },
  };
}

function mapTaxes(data) {
  const byYear = {};
  for (const row of data.results ?? []) {
    const year = String(row["år"]);
    const tax = parseFloat(row["summa, exkl. kyrkoavgift"]);
    if (!year || Number.isNaN(tax)) continue;
    byYear[year] = tax;
  }
  const years = Object.keys(byYear).sort();
  return {
    taxYear: years.at(-1),
    tax: byYear[years.at(-1)],
    taxSeries: { year: years, values: years.map((year) => byYear[year]) },
  };
}

export async function getActualCityData(city1, city2) {
  const [
    [electionData1, electionError1],
    [electionData2, electionError2],
    [electionMuniData1, electionMuniError1],
    [electionMuniData2, electionMuniError2],
    [incomeData1, incomeError1],
    [incomeData2, incomeError2],
    [populationByGender1, genPopError1],
    [populationByGender2, genPopError2],
    [housePrices1, houseError1],
    [housePrices2, houseError2],
    [taxes1, taxes1error],
    [taxes2, taxes2error],
    [jobs1, jobs1err],
    [jobs2, jobs2err],
  ] = await Promise.all([
    getElectionData(city1.lauCode),
    getElectionData(city2.lauCode),
    getMuniElectionData(city1.lauCode),
    getMuniElectionData(city2.lauCode),
    getIncome(city1.lauCode),
    getIncome(city2.lauCode),
    getGenPopulation(city1.lauCode),
    getGenPopulation(city2.lauCode),
    getHousePrices(city1.lauCode),
    getHousePrices(city2.lauCode),
    getTaxes(city1.name.toUpperCase()),
    getTaxes(city2.name.toUpperCase()),
    getJobListings(city1.name),
    getJobListings(city2.name),
  ]);

  city1.jobs = jobs1 ?? jobs1err;
  city2.jobs = jobs2 ?? jobs2err;

  city1.income = !incomeError1 ? mapIncome(incomeData1, city1.lauCode) : incomeError1;
  city2.income = !incomeError2 ? mapIncome(incomeData2, city2.lauCode) : incomeError2;

  if (!houseError1) {
    Object.assign(city1, mapHousePrices(housePrices1, city1.lauCode));
  } else {
    city1.housePrice = houseError1;
  }
  if (!houseError2) {
    Object.assign(city2, mapHousePrices(housePrices2, city2.lauCode));
  } else {
    city2.housePrice = houseError2;
  }

  if (!genPopError1) {
    mapPopulationByGender(city1, populationByGender1);
  } else {
    city1.population = genPopError1;
  }
  if (!genPopError2) {
    mapPopulationByGender(city2, populationByGender2);
  } else {
    city2.population = genPopError2;
  }

  city1.electionData = !electionError1 ? mapElection(electionData1, city1.lauCode) : electionError1;
  city2.electionData = !electionError2 ? mapElection(electionData2, city2.lauCode) : electionError2;
  city1.electionMuniData = !electionMuniError1
    ? mapElection(electionMuniData1, city1.lauCode)
    : electionMuniError1;
  city2.electionMuniData = !electionMuniError2
    ? mapElection(electionMuniData2, city2.lauCode)
    : electionMuniError2;

  if (taxes1error == null) {
    Object.assign(city1, mapTaxes(taxes1));
  } else {
    city1.tax = taxes1error;
  }
  if (taxes2error == null) {
    Object.assign(city2, mapTaxes(taxes2));
  } else {
    city2.tax = taxes2error;
  }
}

export async function jobsByField(occupations, cityName) {
  return getJobListingsByField(occupations, cityName);
}
