
export const getElectionData = async (city) => {
    try {
        const response = await fetch(`/api/scb/election/${city}`, {
            method: "post"
        });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export const getHousePrices = async (city) => {
    try {
        const response = await fetch(`/api/scb/houseprice/${city}`, {
            method: "post"
        });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export const getGenPopulation = async (city) => {
    try {
        const response = await fetch(`/api/scb/pop/${city}`,
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

export const getPopulationGrowth = async (city) => {
    try {
        const response = await fetch(`/api/scb/growth/${city}`,
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

export const getIncome = async (city) => {
    try {
        const response = await fetch(`/api/scb/income/${city}`,
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



// export async function getPopulationGrowth(city1, city2) {

//     const [data, error] = await getSCBPopulationGrowthData(city1, city2);
//     if (error == null) {
//         return [data, null]
//     }
//     else {
//         return [null, error]
//     }
// }

// export async function getGenPopulation(city1, city2) {

//     const [data, error] = await getSCBPopulationData(city1, city2);
//     if (error == null) {
//         return [data, null]
//     }
//     else {
//         return [null, error]
//     }
// }