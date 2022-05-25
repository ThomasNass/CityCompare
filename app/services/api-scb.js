


const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

export const getSCBPopulationData = async (body) => {
    try {
        const response = await fetch("/api/scb/pop",
            {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export const getSCBIncomeData = async (body) => {
    try {
        const response = await fetch("/api/scb/income",
            {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
        const data = await response.json();
        return [data, null]
    }
    catch (err) {
        return [null, err]
    }
}

export async function getIncome(city1, city2) {
    const body = {
        "query": [
            {
                "code": "Region",
                "selection": {
                    "filter": "vs:RegionKommun07EjAggr",
                    "values": [
                        `${city1}`,
                        `${city2}`
                    ]
                }
            },
            {
                "code": "Alder",
                "selection": {
                    "filter": "item",
                    "values": [
                        "20-64"
                    ]
                }
            },
            {
                "code": "Inkomstklass",
                "selection": {
                    "filter": "item",
                    "values": [
                        "TOT"
                    ]
                }
            },
            {
                "code": "ContentsCode",
                "selection": {
                    "filter": "item",
                    "values": [
                        "HE0110K1",
                        "HE0110K2"
                    ]
                }
            },
            {
                "code": "Tid",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2020"
                    ]
                }
            }
        ],
        "response": {
            "format": "json"
        }
    }
    return await getSCBIncomeData(body);
}

export async function getPopulationGrowth(city1, city2) {
    const body = {
        "query": [
            {
                "code": "Region",
                "selection": {
                    "filter": "vs:RegionKommun07",
                    "values": [
                        `${city1}`,
                        `${city2}`
                    ]
                }
            },
            {
                "code": "ContentsCode",
                "selection": {
                    "filter": "item",
                    "values": [
                        "BE0101N1"
                    ]
                }
            }
        ],
        "response": {
            "format": "json"
        }
    }
    return await getSCBPopulationData(body);
}

export async function getGenPopulation(city1, city2) {
    const body = {
        "query": [
            {
                "code": "Region",
                "selection": {
                    "filter": "vs:RegionKommun07",
                    "values": [
                        `${city1}`,
                        `${city2}`
                    ]
                }
            },
            {
                "code": "ContentsCode",
                "selection": {
                    "filter": "item",
                    "values": [
                        "BE0101N1"
                    ]
                }
            },
            {
                "code": "Kon",
                "selection": {
                    "filter": "item",
                    "values": [
                        "1",
                        "2"
                    ]
                }
            },
            {
                "code": "Tid",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2021"
                    ]
                }
            }
        ],
        "response": {
            "format": "json"
        }
    }
    return await getSCBPopulationData(body);
}