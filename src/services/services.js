import { getJobListings, getTaxes, getJobListingsByField } from "./api-caller.js";
import {
  getGenPopulation,
  getIncome,
  getHousePrices,
  getElectionData,
  getMuniElectionData,
  getEducation,
} from "./api-scb.js";
import { getKoladaSchool, getUpperSchoolUnits } from "./api-schools.js";
import { KOLADA_KPIS } from "../../lib/kolada.js";

function yearFromKey(key) {
  return [...key].reverse().find((part) => /^\d{4}$/.test(part));
}

function partyName(code) {
  return code === "FP" ? "L" : code;
}

function toNumber(value) {
  if (value == null || value === ".." || value === ".") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function latestFinite(values) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (Number.isFinite(values[index])) return values[index];
  }
  return undefined;
}

function mapElection(data, lauCode) {
  const byYear = {};
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    const party = partyName(element.key[1]);
    const share = toNumber(element.values[0]);
    if (!year || share == null) continue;
    if (!byYear[year]) byYear[year] = { parties: [], share: [] };
    byYear[year].parties.push(party);
    byYear[year].share.push(share);
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
  for (const element of populationByGender.data ?? []) {
    if (element.key[0] !== city.lauCode) continue;
    const year = yearFromKey(element.key);
    if (!year) continue;
    if (!byYear[year]) byYear[year] = { men: 0, fem: 0 };
    const count = toNumber(element.values[0]) ?? 0;
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
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    if (!year) continue;
    years.push(year);
    values.push(toNumber(element.values[0]));
  }
  return {
    housePriceYear: years.at(-1),
    housePrice: latestFinite(values),
    housePriceSeries: { year: years, values },
  };
}

function mapIncome(data, lauCode) {
  const years = [];
  const average = [];
  const median = [];
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    if (!year) continue;
    years.push(year);
    average.push(toNumber(element.values[0]));
    median.push(toNumber(element.values[1]));
  }
  return {
    year: years.at(-1),
    average: latestFinite(average),
    median: latestFinite(median),
    series: { year: years, average, median },
  };
}

function mapTaxes(data) {
  const byYear = {};
  for (const row of data.results ?? []) {
    const year = String(row["år"]);
    const tax = toNumber(row["summa, exkl. kyrkoavgift"]);
    if (!year || tax == null) continue;
    byYear[year] = tax;
  }
  const years = Object.keys(byYear).sort();
  return {
    taxYear: years.at(-1),
    tax: byYear[years.at(-1)],
    taxSeries: { year: years, values: years.map((year) => byYear[year]) },
  };
}

function seriesFromMap(byYear) {
  const years = Object.keys(byYear).sort();
  return {
    year: years.at(-1),
    value: byYear[years.at(-1)],
    series: { year: years, values: years.map((year) => byYear[year]) },
  };
}

function mapKolada(data) {
  const byKpi = {};
  for (const row of data.values ?? []) {
    const total = (row.values ?? []).find((item) => item.gender === "T") ?? row.values?.[0];
    const value = toNumber(total?.value);
    if (value == null || row.period == null) continue;
    const kpi = row.kpi;
    if (!byKpi[kpi]) byKpi[kpi] = {};
    byKpi[kpi][String(row.period)] = value;
  }

  const pick = (id) => seriesFromMap(byKpi[id] ?? {});

  return {
    school: {
      preschool: {
        qualified: pick(KOLADA_KPIS.preschoolQualified),
        childrenPerStaff: pick(KOLADA_KPIS.preschoolChildrenPerStaff),
        municipalUnits: pick(KOLADA_KPIS.preschoolMunicipal),
        independentUnits: pick(KOLADA_KPIS.preschoolIndependent),
      },
      compulsory: {
        qualified: pick(KOLADA_KPIS.compulsoryQualified),
        pupilsPerTeacher: pick(KOLADA_KPIS.compulsoryPupilsPerTeacher),
        merit: pick(KOLADA_KPIS.compulsoryMerit),
        eligible: pick(KOLADA_KPIS.compulsoryEligible),
        municipalSchools: pick(KOLADA_KPIS.compulsoryMunicipalSchools),
        independentSchools: pick(KOLADA_KPIS.compulsoryIndependentSchools),
      },
      upper: {
        qualified: pick(KOLADA_KPIS.upperQualified),
        pupilsPerTeacher: pick(KOLADA_KPIS.upperPupilsPerTeacher),
        exam: pick(KOLADA_KPIS.upperExam),
        uniEligible: pick(KOLADA_KPIS.upperUniEligible),
        uniAfter: pick(KOLADA_KPIS.upperUniAfter),
        independentShare: pick(KOLADA_KPIS.upperIndependentShare),
      },
    },
  };
}

function mapEducation(data, lauCode) {
  const byYear = {};
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const level = element.key.find((part) => /^[1-7]$|^US$/.test(part));
    const year = yearFromKey(element.key);
    const count = toNumber(element.values[0]);
    if (!year || count == null || !level || level === "US") continue;
    if (!byYear[year]) byYear[year] = { pre: 0, gym: 0, post: 0 };
    if (level === "1" || level === "2") byYear[year].pre += count;
    else if (level === "3" || level === "4") byYear[year].gym += count;
    else byYear[year].post += count;
  }
  const years = Object.keys(byYear).sort();
  const shares = years.map((year) => {
    const total = byYear[year].pre + byYear[year].gym + byYear[year].post;
    const pct = (value) => (total ? (value / total) * 100 : null);
    return {
      pre: pct(byYear[year].pre),
      gym: pct(byYear[year].gym),
      post: pct(byYear[year].post),
    };
  });
  const latest = shares.at(-1) ?? {};
  return {
    education: {
      year: years.at(-1),
      preSecondary: latest.pre,
      secondary: latest.gym,
      postSecondary: latest.post,
      series: {
        year: years,
        preSecondary: shares.map((item) => item.pre),
        secondary: shares.map((item) => item.gym),
        postSecondary: shares.map((item) => item.post),
      },
    },
  };
}

function mapUpperUnits(data, lauCode) {
  const totals = {};
  const municipal = {};
  const independent = {};
  for (const element of data.data ?? []) {
    const measure = element.key[0];
    const region = element.key[1];
    if (region !== lauCode) continue;
    const year = yearFromKey(element.key) ?? element.key.at(-1);
    const value = toNumber(element.values[0]);
    if (!year || value == null) continue;
    if (measure === "9") totals[year] = value;
    if (measure === "11") municipal[year] = value;
    if (measure === "10") independent[year] = value;
  }
  return {
    upperUnits: {
      total: seriesFromMap(totals),
      municipal: seriesFromMap(municipal),
      independent: seriesFromMap(independent),
    },
  };
}

function assignMapped(target, error, data, mapper) {
  if (error || !data) return;
  try {
    const mapped = mapper(data);
    if (mapped && typeof mapped === "object") Object.assign(target, mapped);
  } catch {
    // Keep the city usable even if one dataset fails to parse.
  }
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
    [jobs1],
    [jobs2],
    [kolada1, koladaError1],
    [kolada2, koladaError2],
    [education1, educationError1],
    [education2, educationError2],
    [upperUnits1, upperUnitsError1],
    [upperUnits2, upperUnitsError2],
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
    getKoladaSchool(city1.lauCode),
    getKoladaSchool(city2.lauCode),
    getEducation(city1.lauCode),
    getEducation(city2.lauCode),
    getUpperSchoolUnits(city1.lauCode),
    getUpperSchoolUnits(city2.lauCode),
  ]);

  city1.jobs = jobs1;
  city2.jobs = jobs2;

  assignMapped(city1, incomeError1, incomeData1, (data) => ({
    income: mapIncome(data, city1.lauCode),
  }));
  assignMapped(city2, incomeError2, incomeData2, (data) => ({
    income: mapIncome(data, city2.lauCode),
  }));

  assignMapped(city1, houseError1, housePrices1, (data) => mapHousePrices(data, city1.lauCode));
  assignMapped(city2, houseError2, housePrices2, (data) => mapHousePrices(data, city2.lauCode));

  if (!genPopError1 && populationByGender1) {
    try {
      mapPopulationByGender(city1, populationByGender1);
    } catch {
      city1.population = {};
    }
  }
  if (!genPopError2 && populationByGender2) {
    try {
      mapPopulationByGender(city2, populationByGender2);
    } catch {
      city2.population = {};
    }
  }

  assignMapped(city1, electionError1, electionData1, (data) => ({
    electionData: mapElection(data, city1.lauCode),
  }));
  assignMapped(city2, electionError2, electionData2, (data) => ({
    electionData: mapElection(data, city2.lauCode),
  }));
  assignMapped(city1, electionMuniError1, electionMuniData1, (data) => ({
    electionMuniData: mapElection(data, city1.lauCode),
  }));
  assignMapped(city2, electionMuniError2, electionMuniData2, (data) => ({
    electionMuniData: mapElection(data, city2.lauCode),
  }));

  assignMapped(city1, taxes1error, taxes1, mapTaxes);
  assignMapped(city2, taxes2error, taxes2, mapTaxes);

  assignMapped(city1, koladaError1, kolada1, mapKolada);
  assignMapped(city2, koladaError2, kolada2, mapKolada);
  assignMapped(city1, educationError1, education1, (data) => mapEducation(data, city1.lauCode));
  assignMapped(city2, educationError2, education2, (data) => mapEducation(data, city2.lauCode));
  assignMapped(city1, upperUnitsError1, upperUnits1, (data) => mapUpperUnits(data, city1.lauCode));
  assignMapped(city2, upperUnitsError2, upperUnits2, (data) => mapUpperUnits(data, city2.lauCode));
}

export async function jobsByField(occupations, cityName) {
  return getJobListingsByField(occupations, cityName);
}
