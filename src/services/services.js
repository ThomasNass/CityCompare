import { getJobListings, getTaxes, getJobListingsByField } from "./api-caller.js";
import {
  getGenPopulation,
  getIncome,
  getPopulationGrowth,
  getHousePrices,
  getElectionData,
  getMuniElectionData,
} from "./api-scb.js";

function mapElection(data) {
  const electionData = { parties: [], share: [] };
  for (const element of data.data) {
    electionData.parties.push(element.key[1] === "FP" ? "L" : element.key[1]);
    electionData.share.push(parseFloat(element.values[0]));
  }
  return electionData;
}

function mapPopulationByGender(city, populationByGender) {
  for (const element of populationByGender.data) {
    if (element.key[0] !== city.lauCode) continue;
    if (element.key[1] == 1) {
      city.population.men = parseInt(element.values[0], 10);
    } else {
      city.population.fem = parseInt(element.values[0], 10);
    }
    city.population.total = city.population.men + city.population.fem;
  }
}

function mapGrowth(city, growthData) {
  city.population.growth = { year: [], population: [] };
  for (const element of growthData.data) {
    if (element.key[0] !== city.lauCode) continue;
    city.population.growth.year.push(element.key[1]);
    city.population.growth.population.push(element.values[0]);
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
    [growthData1, growthError1],
    [growthData2, growthError2],
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
    getPopulationGrowth(city1.lauCode),
    getPopulationGrowth(city2.lauCode),
    getHousePrices(city1.lauCode),
    getHousePrices(city2.lauCode),
    getTaxes(city1.name.toUpperCase()),
    getTaxes(city2.name.toUpperCase()),
    getJobListings(city1.name),
    getJobListings(city2.name),
  ]);

  city1.jobs = jobs1 ?? jobs1err;
  city2.jobs = jobs2 ?? jobs2err;

  city1.income = !incomeError1
    ? { average: incomeData1.data[0].values[0], median: incomeData1.data[0].values[1] }
    : incomeError1;
  city2.income = !incomeError2
    ? { average: incomeData2.data[0].values[0], median: incomeData2.data[0].values[1] }
    : incomeError2;

  city1.housePrice = !houseError1 ? parseInt(housePrices1.data[0].values[0], 10) : houseError1;
  city2.housePrice = !houseError2 ? parseInt(housePrices2.data[0].values[0], 10) : houseError2;

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

  city1.electionData = !electionError1 ? mapElection(electionData1) : electionError1;
  city2.electionData = !electionError2 ? mapElection(electionData2) : electionError2;
  city1.electionMuniData = !electionMuniError1
    ? mapElection(electionMuniData1)
    : electionMuniError1;
  city2.electionMuniData = !electionMuniError2
    ? mapElection(electionMuniData2)
    : electionMuniError2;

  if (!growthError1) {
    mapGrowth(city1, growthData1);
  }
  if (!growthError2) {
    mapGrowth(city2, growthData2);
  }

  city1.tax =
    taxes1error == null ? parseFloat(taxes1.results[0]["summa, exkl. kyrkoavgift"]) : taxes1error;
  city2.tax =
    taxes2error == null ? parseFloat(taxes2.results[0]["summa, exkl. kyrkoavgift"]) : taxes2error;
}

export async function jobsByField(occupations, cityName) {
  return getJobListingsByField(occupations, cityName);
}
