import fetch from 'node-fetch';
import express from 'express';
import crypto from "crypto";


const callerId = "MuniMatch";
const key = "GsgD4yGDbIooku02ocUPatpvSug3kawuwjrxlhri";



const app = express()
const port = 3000

const route = express.static("./dist")



app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.get("/api/hitta/:company/:municipality", async (req, res) => {

    const { company, municipality } = req.params;
    const cacheKey = `hitta-${company.toLowerCase()}-${municipality.toLowerCase()}`;

    let data = getFromCache(cacheKey)
    if (!data) {
        console.log("API ANROP")
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

app.use(route)

app.listen(port, () => {
    console.log(`Example app listening on port${port}`)
})

// scripts": {
// "reverse-proxy": "ws --directory dist --port 1234 --rewrite \"/api/hitta/:1/:2 -> https://api.hitta.se/publicsearch/v1/companies?what=:1&where=:2&page.number=1&page.size=20\" --rewrite \"/api/scb/pop -> https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BE/BE0101/BE0101A/BefolkningNy\" --rewrite \"/api/scb/income -> https://api.scb.se/OV0104/v1/doris/sv/ssd/START/HE/HE0110/HE0110A/SamForvInk2\"",
//     "start-app": "parcel watch app.html",
//         "start": "run-p start-app reverse-proxy"


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





