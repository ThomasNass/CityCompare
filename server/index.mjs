import fetch from 'node-fetch';
import express from 'express';
import crypto from "crypto";
import path from "path";


const callerId = "KommunKollen";
const key = "CuhpqFUceLTAKg1hBPHTif0QPamspTUR8qkLa2ZO";



const app = express()
const port = 3000

const route = express.static("./dist")



app.get("/", (req, res) => {
    res.sendFile("/app.html"))
})

app.get("/api/hitta/:company/:municipality", async (req, res) => {

    const { company, municipality } = req.params;
    const cacheKey = `hitta-${company.toLowerCase()}-${municipality.toLowerCase()}`;

    let data = getFromCache(cacheKey)
    if (!data) {
        let random = makeRandom(16);
        let date = new Date();
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        let hashed = await getHash(unixTimestamp, random);
        let headers = {
            "Content-Type": "application/json",
            "hitta-callerid": callerId,
            "hitta-time": unixTimestamp,
            "hitta-random": random,
            "hitta-hash": hashed
        }
        const response = await fetch(`https://api.hitta.se/publicsearch/v1/companies?what=${company}&where=${municipality}&page.number=1&page.size=2`,
            {
                method: "GET",
                headers: headers
            });
        data = await response.json();
        res.status(response.status)
        saveToCache(cacheKey, data);
    }
    res.send(data);


})

app.post("/api/scb/houseprice/:city", async (req, res) => {
    const { city } = req.params;
    const cacheKey = `houseprice-${city.toLowerCase()}`;

    let data = getFromCache(cacheKey);
    if (!data) {
        console.log("API ANROP")
        const body = {
            "query": [
                {
                    "code": "Region",
                    "selection": {
                        "filter": "vs:RegionKommun07EjAggr",
                        "values": [
                            `${city}`

                        ]
                    }
                },
                {
                    "code": "Fastighetstyp",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "220"
                        ]
                    }
                },
                {
                    "code": "ContentsCode",
                    "selection": {
                        "filter": "item",
                        "values": [
                            "BO0501C2"
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

        const response = await fetch("https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501B/FastprisSHRegionAr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })
        data = await response.json();
        res.status(response.status);
        saveToCache(cacheKey, data)
    }
    res.send(data);

})

app.post("/api/scb/income/:city", async (req, res) => {
    const { city } = req.params;
    const cacheKey = `income-${city.toLowerCase()}`
    let data = getFromCache(cacheKey);
    if (!data) {
        const body = {
            "query": [
                {
                    "code": "Region",
                    "selection": {
                        "filter": "vs:RegionKommun07EjAggr",
                        "values": [
                            `${city}`

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

        const response = await fetch("https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })
        data = await response.json();
        res.status(response.status);
        saveToCache(cacheKey, data)
    }
    res.send(data);
})

app.post("/api/scb/growth/:city", async (req, res) => {
    const { city } = req.params;
    const cacheKey = `growth-${city.toLowerCase()}`
    let data = getFromCache(cacheKey);
    if (!data) {
        const body = {
            "query": [
                {
                    "code": "Region",
                    "selection": {
                        "filter": "vs:RegionKommun07",
                        "values": [
                            `${city}`

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

        const response = await fetch("https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })
        data = await response.json();
        res.status(response.status);
        saveToCache(cacheKey, data)
    }
    res.send(data);
})

app.post("/api/scb/pop/:city", async (req, res) => {
    const { city } = req.params;
    const cacheKey = `pop-${city.toLowerCase()}`
    let data = getFromCache(cacheKey);
    if (!data) {
        const body = {
            "query": [
                {
                    "code": "Region",
                    "selection": {
                        "filter": "vs:RegionKommun07",
                        "values": [
                            `${city}`

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

        const response = await fetch("https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        })
        data = await response.json();
        res.status(response.status);
        saveToCache(cacheKey, data);
    }
    res.send(data);
})

app.use(route)

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port${port} or ${process.env.PORT}`)
})



const cache = {}
function getFromCache(cacheKey) {
    if (cache[cacheKey]) {
        return cache[cacheKey]
    }
    return undefined;
}

function saveToCache(cacheKey, data) {
    cache[cacheKey] = data;

}

const getHash = async (unixTimestamp, random) => {
    const hashed = await sha256(callerId + unixTimestamp + key + random);

    return hashed;
}


function makeRandom(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

async function sha256(message) {

    return crypto.createHash('sha256').update(message).digest('hex');
}





