const callerId = "MuniMatch";
const key = "GsgD4yGDbIooku02ocUPatpvSug3kawuwjrxlhri";
let random = makeRandom(16);
let date = new Date();
const unixTimestamp = Math.floor(date.getTime() / 1000);



const getHash = async () => {
    hashed = await sha256(callerId + unixTimestamp + key + random);

    return hashed;
}



const getData = async (headers, buisness, city) => {
    const response = await fetch(`/api/hitta/${buisness}/${city}`,
        {
            method: "GET",
            headers: headers
        });
    const data = await response.json();
    return data;
}


export async function hitta(city, buisness) {
    let hashed = await getHash();
    let headers = {
        "Content-Type": "application/json",
        "hitta-callerid": callerId,
        "hitta-time": unixTimestamp,
        "hitta-random": random,
        "hitta-hash": hashed
    }
    let data = await getData(headers, city, buisness);
    // console.log(buisness);
    // console.log(data)
    if (data.result.companies.total > 0) {
        // console.log(data, data.result.companies.company[0].displayName);
        return "ja";
    }
    else {
        // console.log(data, "nej")
        return "nej";
    }
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
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}





