
const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const getSCBPopulationData = async (city1, city2) => {
    try {
        const response = await fetch(`/api/scb/pop/${city1}/${city2}`,
            {
                method: "post"
            });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export const getSCBPopulationGrowthData = async (city1, city2) => {
    try {
        const response = await fetch(`/api/scb/growth/${city1}/${city2}`,
            {
                method: "post"
            });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export const getSCBIncomeData = async (city1, city2) => {
    try {
        const response = await fetch(`/api/scb/income/${city1}/${city2}`,
            {
                method: "POST"
            });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export async function getIncome(city1, city2) {

    const [data, error] = await getSCBIncomeData(city1, city2);
    if (error == null) {
        return [data, null]
    }
    else {
        return [null, error]
    }



}

export async function getPopulationGrowth(city1, city2) {

    const [data, error] = await getSCBPopulationGrowthData(city1, city2);
    if (error == null) {
        return [data, null]
    }
    else {
        return [null, error]
    }
}

export async function getGenPopulation(city1, city2) {

    const [data, error] = await getSCBPopulationData(city1, city2);
    if (error == null) {
        return [data, null]
    }
    else {
        return [null, error]
    }
}