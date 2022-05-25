import { getJobListings, getKronofogdenApplications, getKronofogdenEvictions, getTaxes } from "./api-caller.js";
import { getGenPopulation, getIncome, getPopulationGrowth } from "./api-scb.js";
import { hitta } from "./api-hitta.js";
import franchises from "./franchises.json"


export async function getActualCityData(city1, city2) {

    const [incomeData, incomeError] = await getIncome(city1.lauCode, city2.lauCode)
    console.log(incomeData)
    const [populationByGender, genPopError] = await getGenPopulation(city1.lauCode, city2.lauCode);
    const [growth, growthError] = await getPopulationGrowth(city1.lauCode, city2.lauCode);
    console.log(city1.lauCode, city2.lauCode)
    console.log(growth);



    const [taxes1, taxes1error] = await getTaxes(city1.name.toUpperCase());
    const [taxes2, taxes2error] = await getTaxes(city2.name.toUpperCase());
    const applications1 = await getKronofogdenApplications(city1.name);
    const applications2 = await getKronofogdenApplications(city2.name);
    const evictions1 = await getKronofogdenEvictions(city1.name.toUpperCase());
    const evictions2 = await getKronofogdenEvictions(city2.name.toUpperCase());

    const [jobs1, jobs1err] = await getJobListings(city1.name);
    const [jobs2, jobs2err] = await getJobListings(city2.name);

    if (jobs1) {
        city1.jobs = jobs1
    }
    else {
        city1.jobs = jobs1err
    }
    if (jobs2) {
        city2.jobs = jobs2
    }
    else {
        city2.jobs = jobs2err
    }



    city1.kronofogdenApplications = getYearsAndApplications(applications1);
    city2.kronofogdenApplications = getYearsAndApplications(applications2);
    city1.kronofogdenEvictions = getEvictions(evictions1);
    city2.kronofogdenEvictions = getEvictions(evictions2);

    if (incomeError == null) {
        city1.income = {
            average: incomeData.data[0].values[0],
            median: incomeData.data[0].values[1]
        }
        city2.income = {
            average: incomeData.data[1].values[0],
            median: incomeData.data[1].values[1]
        }

    }
    else {
        city1.income = incomeError
        city2.income = incomeError
    }

    if (genPopError == null) {
        city1.population = {
            total: parseInt(populationByGender.data[0].values[0]) + parseInt(populationByGender.data[1].values[0]),
            men: parseInt(populationByGender.data[0].values[0]),
            fem: parseInt(populationByGender.data[1].values[0])
        }
        city2.population = {
            total: parseInt(populationByGender.data[2].values[0]) + parseInt(populationByGender.data[3].values[0]),
            men: parseInt(populationByGender.data[2].values[0]),
            fem: parseInt(populationByGender.data[3].values[0])
        }


    } else {
        city1.population = genPopError
        city2.population = genPopError
    }

    if (!growthError) {
        city1.population.growth = { year: [], population: [] }
        city2.population.growth = { year: [], population: [] }
        growth.data.map((element) => {
            if (element.key[0] == city1.lauCode) {
                city1.population.growth.year.push(element.key[1])
                city1.population.growth.population.push(element.values[0])
            }
            if (element.key[0] == city2.lauCode) {
                city2.population.growth.year.push(element.key[1])
                city2.population.growth.population.push(element.values[0])
            }

        })
    }


    if (taxes1) {
        city1.tax = parseFloat(taxes1.results[0]["summa, exkl. kyrkoavgift"])
    }
    else {
        city1.tax = taxes1error;
    }
    if (taxes2) {
        city2.tax = parseFloat(taxes2.results[0]["summa, exkl. kyrkoavgift"])
    }
    else {
        city2.tax = taxes2error;
    }


}

getEvictions = (array) => {
    const evictionsArray = [];
    let obj = {};
    if (array.results.length > 0) {
        array.results.forEach(eviction => {
            obj.evictions = eviction["antal genomförda vräkningar"];
            obj.applications = eviction["antal ansökningar om vräkning"];

        })
    }
    else {
        obj.evictions = 0;
        obj.applications = 0;
    }

    evictionsArray.push(obj);
    return evictionsArray;
}

getYearsAndApplications = (array) => {
    const applicationArray = [];
    array.results.forEach(application => {
        let obj = {};
        obj.amount = application["antal ansökningar"];
        obj.year = application.år;
        applicationArray.push(obj);
    });
    return applicationArray;
}

//Funktion för att Formatera en sträng till Stor bokstav i början och små bokstäver efter det
export function formatInput(string) {
    let lower = string.toLowerCase();
    let firstUpper = lower.charAt(0).toUpperCase() + lower.substr(1);
    return firstUpper;
}


export async function getBuisnesses(city1, city2) {
    let citiesCompared = [];
    for (const franchise in franchises.franchises) {
        let comparison = {}
        comparison.buisness = franchises.franchises[franchise];
        comparison.city1 = await hitta(city1, franchises.franchises[franchise])
        comparison.city2 = await hitta(city2, franchises.franchises[franchise])
        citiesCompared.push(comparison);
    }
    console.log(citiesCompared);
    return citiesCompared;

}

export async function getBuiseness(city1, city2, buisness) {
    let citiesCompared = [];
    let comparison = {};
    comparison.buisness = buisness;
    comparison.city1 = await hitta(city1, buisness)
    comparison.city2 = await hitta(city2, buisness)
    citiesCompared.push(comparison);
    return citiesCompared;
}