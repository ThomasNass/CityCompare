import { getJobListings, getTaxes, getJobListingsByField } from "./api-caller.js";
import { getGenPopulation, getIncome, getPopulationGrowth } from "./api-scb.js";
import { hitta } from "./api-hitta.js";
import franchises from "./franchises.json"



export async function getActualCityData(city1, city2) {

    const [incomeData, incomeError] = await getIncome(city1.lauCode, city2.lauCode)
    const [populationByGender, genPopError] = await getGenPopulation(city1.lauCode, city2.lauCode);
    const [growthData, growthError] = await getPopulationGrowth(city1.lauCode, city2.lauCode);
    console.log(populationByGender);



    const [taxes1, taxes1error] = await getTaxes(city1.name.toUpperCase());
    const [taxes2, taxes2error] = await getTaxes(city2.name.toUpperCase());


    const [jobs1, jobs1err] = await getJobListings(city1.name);
    const [jobs2, jobs2err] = await getJobListings(city2.name);

    if (jobs1 != null) {
        city1.jobs = jobs1
    }
    else {
        city1.jobs = jobs1err
    }
    if (jobs2 != null) {
        city2.jobs = jobs2
    }
    else {
        city2.jobs = jobs2err
    }


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

        populationByGender.data.map((element) => {

            if (element.key[0] == city1.lauCode) {
                if (element.key[1] == 1) {
                    city1.population.men = parseInt(element.values[0])
                }
                else {
                    city1.population.fem = parseInt(element.values[0])
                }
            }
            if (element.key[0] == city2.lauCode) {
                if (element.key[1] == 1) {
                    city2.population.men = parseInt(element.values[0])
                }
                else {
                    city2.population.fem = parseInt(element.values[0])
                }
            }
            city1.population.total = city1.population.men + city1.population.fem
            city2.population.total = city2.population.men + city2.population.fem
        })

    } else {
        city1.population = genPopError
        city2.population = genPopError
    }

    if (growthError == null) {
        city1.population.growth = { year: [], population: [] }
        city2.population.growth = { year: [], population: [] }
        growthData.data.map((element) => {
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



    if (taxes1error == null) {
        city1.tax = parseFloat(taxes1.results[0]["summa, exkl. kyrkoavgift"])
    }
    else {
        city1.tax = taxes1error;
    }
    if (taxes2error == null) {
        city2.tax = parseFloat(taxes2.results[0]["summa, exkl. kyrkoavgift"])
    }
    else {
        city2.tax = taxes2error;
    }


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
        const [result1, error1] = await hitta(city1, franchises.franchises[franchise])
        if (error1 == null) {
            comparison.city1 = result1
        }
        else {
            return [null, error1]
        }
        const [result2, error2] = await hitta(city2, franchises.franchises[franchise])
        if (error2 == null) {
            comparison.city2 = result2
        }
        else {
            return [null, error2]
        }
        citiesCompared.push(comparison);
    }
    return [citiesCompared, null];

}

export async function getBuiseness(city1, city2, buisness) {
    let citiesCompared = [];
    let comparison = {};
    comparison.buisness = buisness;
    const [result1, error1] = await hitta(buisness, city1)
    if (error1 == null) {
        comparison.city1 = result1
    }
    else {
        return [null, error1]
    }
    const [result2, error2] = await hitta(buisness, city2)
    if (error2 == null) {
        comparison.city2 = result2
    }
    else {
        return [null, error2]
    }
    citiesCompared.push(comparison);
    return [citiesCompared, null];
}

export async function jobsByField(occupations, cityName) {

    return await getJobListingsByField(occupations, cityName)

}