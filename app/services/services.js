import { getJobListings, getKronofogdenApplications, getKronofogdenEvictions, getPopulation, getTaxes } from "./api-caller.js";
import { hitta } from "./api-hitta.js";
import franchises from "./franchises.json"
export async function getActualCityData(city1, city2) {
    const pop1 = await getPopulation(city1.name);
    const pop2 = await getPopulation(city2.name);
    const taxes1 = await getTaxes(city1.name.toUpperCase());
    const taxes2 = await getTaxes(city2.name.toUpperCase());
    const applications1 = await getKronofogdenApplications(city1.name);
    const applications2 = await getKronofogdenApplications(city2.name);
    const evictions1 = await getKronofogdenEvictions(city1.name.toUpperCase());
    const evictions2 = await getKronofogdenEvictions(city2.name.toUpperCase());

    city1.jobs = await getJobListings(city1.name);
    city2.jobs = await getJobListings(city2.name);



    city1.kronofogdenApplications = getYearsAndApplications(applications1);
    city2.kronofogdenApplications = getYearsAndApplications(applications2);
    city1.kronofogdenEvictions = getEvictions(evictions1);
    city2.kronofogdenEvictions = getEvictions(evictions2);
    city1.tax = parseFloat(taxes1.results[0]["summa, exkl. kyrkoavgift"])
    city2.tax = parseFloat(taxes2.results[0]["summa, exkl. kyrkoavgift"])
    city1.population = parseInt(pop1.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));
    city2.population = parseInt(pop2.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));

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

    console.log("Här kollar vi efter loopen", obj)
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