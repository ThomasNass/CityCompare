import { getJobListings, getJobListingsByField } from "./api-caller.js";
import {
  getElectionData,
  getMuniElectionData,
  getRegionElectionData,
  getIncome,
  getHousePrices,
  getGenPopulation,
  getEducation,
  getMunicipalTax,
  getGreenSpace,
} from "./api-scb.js";
import { getKoladaSchool, getUpperSchoolUnits, getPreschoolUnits, getCompulsoryUnits, getPreschoolStaff, getUpperResults } from "./api-schools.js";
import { getBeaches, getAirQuality, getRegionCare } from "./api-live.js";
import { CARE_KPIS, KOLADA_KPIS } from "../../lib/kolada.js";
import { regionFromLau } from "../../lib/regions.js";

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

function mapGreen(data, lauCode) {
  const byYear = {};
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    const value = toNumber(element.values[0]);
    if (!year || value == null) continue;
    byYear[year] = value;
  }
  const years = Object.keys(byYear).sort();
  return {
    green: {
      year: years.at(-1),
      value: byYear[years.at(-1)],
      series: { year: years, values: years.map((year) => byYear[year]) },
    },
  };
}

function mapCare(data, region) {
  const byKpi = {};
  for (const row of data.values ?? []) {
    const total = (row.values ?? []).find((item) => item.gender === "T") ?? row.values?.[0];
    const value = toNumber(total?.value);
    if (value == null || row.period == null) continue;
    if (!byKpi[row.kpi]) byKpi[row.kpi] = {};
    byKpi[row.kpi][String(row.period)] = value;
  }
  const pick = (id) => seriesFromMap(byKpi[id] ?? {});
  return {
    care: {
      regionId: region?.regionId,
      regionName: region?.name,
      primaryCare: pick(CARE_KPIS.primaryCare3days),
      specialist: pick(CARE_KPIS.specialist90days),
    },
  };
}

function mapTaxes(data, lauCode) {
  const byYear = {};
  for (const element of data.data ?? []) {
    if (element.key[0] !== lauCode) continue;
    const year = yearFromKey(element.key);
    const tax = toNumber(element.values[0]);
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
        gradePoints: pick(KOLADA_KPIS.upperGradePoints),
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

function mapSkolverketMeasures(data, lauCode, measures) {
  const buckets = Object.fromEntries(Object.keys(measures).map((name) => [name, {}]));
  for (const element of data.data ?? []) {
    const measure = element.key[0];
    const region = element.key[1];
    if (region !== lauCode) continue;
    const year = yearFromKey(element.key) ?? element.key.at(-1);
    const value = toNumber(element.values[0]);
    if (!year || value == null) continue;
    for (const [name, code] of Object.entries(measures)) {
      if (measure === code) buckets[name][year] = value;
    }
  }
  return Object.fromEntries(Object.entries(buckets).map(([name, byYear]) => [name, seriesFromMap(byYear)]));
}

function preferSeries(preferred, fallback) {
  return preferred?.value != null ? preferred : fallback;
}

function mergeSchoolLevel(city, level, patch) {
  if (!city.school) city.school = { preschool: {}, compulsory: {}, upper: {} };
  city.school[level] = { ...(city.school[level] ?? {}), ...patch };
}

function mapUpperUnits(data, lauCode) {
  return {
    upperUnits: mapSkolverketMeasures(data, lauCode, {
      total: "9",
      independent: "10",
      municipal: "11",
    }),
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
    [electionRegionData1, electionRegionError1],
    [electionRegionData2, electionRegionError2],
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
    [preschoolUnits1, preschoolUnitsError1],
    [preschoolUnits2, preschoolUnitsError2],
    [compulsoryUnits1, compulsoryUnitsError1],
    [compulsoryUnits2, compulsoryUnitsError2],
    [preschoolStaff1, preschoolStaffError1],
    [preschoolStaff2, preschoolStaffError2],
    [upperResults1, upperResultsError1],
    [upperResults2, upperResultsError2],
    [green1, greenError1],
    [green2, greenError2],
    [beaches1, beachesError1],
    [beaches2, beachesError2],
    [air1],
    [air2],
    [care1, careError1],
    [care2, careError2],
  ] = await Promise.all([
    getElectionData(city1.lauCode),
    getElectionData(city2.lauCode),
    getMuniElectionData(city1.lauCode),
    getMuniElectionData(city2.lauCode),
    getRegionElectionData(city1.lauCode),
    getRegionElectionData(city2.lauCode),
    getIncome(city1.lauCode),
    getIncome(city2.lauCode),
    getGenPopulation(city1.lauCode),
    getGenPopulation(city2.lauCode),
    getHousePrices(city1.lauCode),
    getHousePrices(city2.lauCode),
    getMunicipalTax(city1.lauCode),
    getMunicipalTax(city2.lauCode),
    getJobListings(city1.name),
    getJobListings(city2.name),
    getKoladaSchool(city1.lauCode),
    getKoladaSchool(city2.lauCode),
    getEducation(city1.lauCode),
    getEducation(city2.lauCode),
    getUpperSchoolUnits(city1.lauCode),
    getUpperSchoolUnits(city2.lauCode),
    getPreschoolUnits(city1.lauCode),
    getPreschoolUnits(city2.lauCode),
    getCompulsoryUnits(city1.lauCode),
    getCompulsoryUnits(city2.lauCode),
    getPreschoolStaff(city1.lauCode),
    getPreschoolStaff(city2.lauCode),
    getUpperResults(city1.lauCode),
    getUpperResults(city2.lauCode),
    getGreenSpace(city1.lauCode),
    getGreenSpace(city2.lauCode),
    getBeaches(city1.lauCode, city1.name),
    getBeaches(city2.lauCode, city2.name),
    getAirQuality(city1.lauCode, city1.name),
    getAirQuality(city2.lauCode, city2.name),
    getRegionCare(regionFromLau(city1.lauCode)?.regionId),
    getRegionCare(regionFromLau(city2.lauCode)?.regionId),
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
  assignMapped(city1, electionRegionError1, electionRegionData1, (data) => ({
    electionRegionData: mapElection(data, city1.lauCode),
  }));
  assignMapped(city2, electionRegionError2, electionRegionData2, (data) => ({
    electionRegionData: mapElection(data, city2.lauCode),
  }));

  assignMapped(city1, taxes1error, taxes1, (data) => mapTaxes(data, city1.lauCode));
  assignMapped(city2, taxes2error, taxes2, (data) => mapTaxes(data, city2.lauCode));

  assignMapped(city1, koladaError1, kolada1, mapKolada);
  assignMapped(city2, koladaError2, kolada2, mapKolada);
  assignMapped(city1, educationError1, education1, (data) => mapEducation(data, city1.lauCode));
  assignMapped(city2, educationError2, education2, (data) => mapEducation(data, city2.lauCode));
  assignMapped(city1, upperUnitsError1, upperUnits1, (data) => mapUpperUnits(data, city1.lauCode));
  assignMapped(city2, upperUnitsError2, upperUnits2, (data) => mapUpperUnits(data, city2.lauCode));

  function applySkolverketUnits(city, preschoolError, preschoolData, compulsoryError, compulsoryData) {
    if (!preschoolError && preschoolData) {
      try {
        const preschool = mapSkolverketMeasures(preschoolData, city.lauCode, {
          municipal: "0",
          independent: "1",
        });
        mergeSchoolLevel(city, "preschool", {
          municipalUnits: preferSeries(preschool.municipal, city.school?.preschool?.municipalUnits),
          independentUnits: preferSeries(preschool.independent, city.school?.preschool?.independentUnits),
        });
      } catch {
        // Keep Kolada values if Skolverket cannot be parsed.
      }
    }
    if (!compulsoryError && compulsoryData) {
      try {
        const compulsory = mapSkolverketMeasures(compulsoryData, city.lauCode, { municipal: "0" });
        mergeSchoolLevel(city, "compulsory", {
          municipalSchools: preferSeries(compulsory.municipal, city.school?.compulsory?.municipalSchools),
        });
      } catch {
        // Keep Kolada values if Skolverket cannot be parsed.
      }
    }
  }

  applySkolverketUnits(city1, preschoolUnitsError1, preschoolUnits1, compulsoryUnitsError1, compulsoryUnits1);
  applySkolverketUnits(city2, preschoolUnitsError2, preschoolUnits2, compulsoryUnitsError2, compulsoryUnits2);

  function applySkolverketStaffAndResults(city, staffError, staffData, resultsError, resultsData) {
    if (!staffError && staffData) {
      try {
        const staff = mapSkolverketMeasures(staffData, city.lauCode, {
          childrenPerStaff: "3",
          qualified: "12",
        });
        mergeSchoolLevel(city, "preschool", {
          qualified: preferSeries(city.school?.preschool?.qualified, staff.qualified),
          childrenPerStaff: preferSeries(city.school?.preschool?.childrenPerStaff, staff.childrenPerStaff),
        });
      } catch {
        // Keep Kolada values if Skolverket cannot be parsed.
      }
    }
    if (!resultsError && resultsData) {
      try {
        const results = mapSkolverketMeasures(resultsData, city.lauCode, {
          gradePoints: "7",
          exam: "34",
        });
        mergeSchoolLevel(city, "upper", {
          exam: preferSeries(city.school?.upper?.exam, results.exam),
          gradePoints: preferSeries(city.school?.upper?.gradePoints, results.gradePoints),
        });
      } catch {
        // Keep Kolada values if Skolverket cannot be parsed.
      }
    }
  }

  applySkolverketStaffAndResults(city1, preschoolStaffError1, preschoolStaff1, upperResultsError1, upperResults1);
  applySkolverketStaffAndResults(city2, preschoolStaffError2, preschoolStaff2, upperResultsError2, upperResults2);

  assignMapped(city1, greenError1, green1, (data) => mapGreen(data, city1.lauCode));
  assignMapped(city2, greenError2, green2, (data) => mapGreen(data, city2.lauCode));

  if (!beachesError1 && beaches1) city1.beaches = beaches1;
  if (!beachesError2 && beaches2) city2.beaches = beaches2;
  if (air1) city1.air = air1;
  if (air2) city2.air = air2;

  assignMapped(city1, careError1, care1, (data) => mapCare(data, regionFromLau(city1.lauCode)));
  assignMapped(city2, careError2, care2, (data) => mapCare(data, regionFromLau(city2.lauCode)));
}

export async function jobsByField(occupations, cityName) {
  return getJobListingsByField(occupations, cityName);
}
