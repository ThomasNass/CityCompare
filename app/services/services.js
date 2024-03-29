import { getJobListings, getTaxes, getJobListingsByField } from "./api-caller.js";
import { getGenPopulation, getIncome, getPopulationGrowth, getHousePrices, getElectionData, getMuniElectionData } from "./api-scb.js";
import { hitta } from "./api-hitta.js";
//import franchises from "./franchises.json"



export async function getActualCityData(city1, city2) {

    const [electionData1, electionError1] = await getElectionData(city1.lauCode);
    const [electionData2, electionError2] = await getElectionData(city2.lauCode);
    const [electionMuniData1, electionMuniError1] = await getMuniElectionData(city1.lauCode);
    const [electionMuniData2, electionMuniError2] = await getMuniElectionData(city2.lauCode);
    const [incomeData1, incomeError1] = await getIncome(city1.lauCode);
    const [incomeData2, incomeError2] = await getIncome(city2.lauCode);
    const [populationByGender1, genPopError1] = await getGenPopulation(city1.lauCode);
    const [populationByGender2, genPopError2] = await getGenPopulation(city2.lauCode);
    const [growthData1, growthError1] = await getPopulationGrowth(city1.lauCode);
    const [growthData2, growthError2] = await getPopulationGrowth(city2.lauCode);
    const [housePrices1, houseError1] = await getHousePrices(city1.lauCode)
    const [housePrices2, houseError2] = await getHousePrices(city2.lauCode)


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


    if (!incomeError1) {
        city1.income = {
            average: incomeData1.data[0].values[0],
            median: incomeData1.data[0].values[1]
        }
    }
    else {
        city1.income = incomeError1
    }
    if (!incomeError2) {
        city2.income = {
            average: incomeData2.data[0].values[0],
            median: incomeData2.data[0].values[1]
        }
    }
    else {
        city2.income = incomeError2
    }


    if (!houseError1) {
        city1.housePrice = parseInt(housePrices1.data[0].values[0])
    }
    else {
        city1.housePrice = houseError1
    }
    if (!houseError2) {
        city2.housePrice = parseInt(housePrices2.data[0].values[0])
    }
    else {
        city2.housePrice = houseError2
    }

    if (!genPopError1) {
        populationByGender1.data.map((element) => {
            if (element.key[0] == city1.lauCode) {
                if (element.key[1] == 1) {
                    city1.population.men = parseInt(element.values[0])
                }
                else {
                    city1.population.fem = parseInt(element.values[0])
                }
            }
            city1.population.total = city1.population.men + city1.population.fem
        })

    }
    else {
        city1.population = genPopError1
    }
    if (!genPopError2) {
        populationByGender2.data.map((element) => {
            if (element.key[0] == city2.lauCode) {
                if (element.key[1] == 1) {
                    city2.population.men = parseInt(element.values[0])
                }
                else {
                    city2.population.fem = parseInt(element.values[0])
                }
            }
            city2.population.total = city2.population.men + city2.population.fem
        })

    }
    else {
        city2.population = genPopError2
    }

    if (!electionError1) {
        city1.electionData = { parties: [], share: [] }
        electionData1.data.map((element) => {
            if (element.key[1] != "FP") { city1.electionData.parties.push(element.key[1]) }
            else {
                city1.electionData.parties.push("L")
            }
            city1.electionData.share.push(parseFloat(element.values[0]))
        })
    }
    else { city1.electionData = electionError1 }

    if (!electionError2) {
        city2.electionData = { parties: [], share: [] }
        electionData2.data.map((element) => {
            if (element.key[1] != "FP") { city2.electionData.parties.push(element.key[1]) }
            else {
                city2.electionData.parties.push("L")
            }

            city2.electionData.share.push(element.values[0])
        })
    }
    else { city2.electionData = electionError2 }

    if (!electionMuniError1) {
        city1.electionMuniData = { parties: [], share: [] }
        electionMuniData1.data.map((element) => {
            if (element.key[1] != "FP") { city1.electionMuniData.parties.push(element.key[1]) }
            else {
                city1.electionMuniData.parties.push("L")
            }
            city1.electionMuniData.share.push(parseFloat(element.values[0]))
        })
    }
    else { city1.electionMuniData = electionMuniError1 }

    if (!electionMuniError2) {
        city2.electionMuniData = { parties: [], share: [] }
        electionMuniData2.data.map((element) => {
            if (element.key[1] != "FP") { city2.electionMuniData.parties.push(element.key[1]) }
            else {
                city2.electionMuniData.parties.push("L")
            }

            city2.electionMuniData.share.push(element.values[0])
        })
    }
    else { city2.electionMuniData = electionMuniError2 }


    if (!growthError1) {
        city1.population.growth = { year: [], population: [] }
        growthData1.data.map((element) => {
            if (element.key[0] == city1.lauCode) {
                city1.population.growth.year.push(element.key[1])
                city1.population.growth.population.push(element.values[0])
            }
        })
    }
    if (!growthError2) {
        city2.population.growth = { year: [], population: [] }
        growthData2.data.map((element) => {
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

//This one sends one comparions at a time
export async function getBuisnesses(city1, city2, franchise) {
    let citiesCompared = [];
    let comparison = {}
    comparison.buisness = franchise;
    const [result1, error1] = await hitta(city1, franchise)
    if (error1 == null) {
        comparison.city1 = result1
    }
    else {
        return [null, error1]
    }
    const [result2, error2] = await hitta(city2, franchise)
    if (error2 == null) {
        comparison.city2 = result2
    }
    else {
        return [null, error2]
    }
    citiesCompared.push(comparison);

    return [citiesCompared, null];

}

//This one sends all comparison once they're done
// export async function _getBuisnesses(city1, city2) {
//     let citiesCompared = [];
//     for (const franchise in franchises.franchises) {
//         let comparison = {}
//         comparison.buisness = franchises.franchises[franchise];
//         const [result1, error1] = await hitta(city1, franchises.franchises[franchise])
//         if (error1 == null) {
//             comparison.city1 = result1
//         }
//         else {
//             return [null, error1]
//         }
//         const [result2, error2] = await hitta(city2, franchises.franchises[franchise])
//         if (error2 == null) {
//             comparison.city2 = result2
//         }
//         else {
//             return [null, error2]
//         }
//         citiesCompared.push(comparison);
//     }
//     return [citiesCompared, null];

// }

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