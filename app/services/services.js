import { getKronofogdenApplications, getKronofogdenEvictions, getPopulation, getTaxes } from "./api-caller.js";

export async function getActualCityData(city1, city2, search1, search2) {
    const pop1 = await getPopulation(search1);
    const pop2 = await getPopulation(search2);
    const taxes1 = await getTaxes(search1.toUpperCase());
    const taxes2 = await getTaxes(search2.toUpperCase());
    const applications1 = await getKronofogdenApplications(search1);
    const applications2 = await getKronofogdenApplications(search2);
    const evictions1 = await getKronofogdenEvictions(search1.toUpperCase());
    const evictions2 = await getKronofogdenEvictions(search2.toUpperCase());

    city1[0].kronofogdenApplications = getYearsAndApplications(applications1);
    city2[0].kronofogdenApplications = getYearsAndApplications(applications2);
    city1[0].kronofogdenEvictions = getEvictions(evictions1);
    city2[0].kronofogdenEvictions = getEvictions(evictions2);
    city1[0].tax = parseFloat(taxes1.results[0]["summa, exkl. kyrkoavgift"])
    city2[0].tax = parseFloat(taxes2.results[0]["summa, exkl. kyrkoavgift"])
    city1[0].population = parseInt(pop1.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));
    city2[0].population = parseInt(pop2.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));

}

getEvictions = (array) => {
    const evictionsArray = [];
    array.results.forEach(eviction => {
        let obj = {};
        obj.evictions = eviction["antal genomförda vräkningar"];
        obj.applications = eviction["antal ansökningar om vräkning"];
        evictionsArray.push(obj);
    })
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