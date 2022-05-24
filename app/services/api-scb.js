
const body = {
    "query": [
        {
            "code": "Region",
            "selection": {
                "filter": "vs:RegionKommun07",
                "values": [
                    "0685",
                    "1499"
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

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

getData = async () => {
    const response = await fetch("/api/scb/pop",
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
    const data = await response.json();
    console.log(data);
    return data;
}

export async function getIt() {
    return await getData();
}
