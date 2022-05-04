import axios from "axios";

export async function getCityData(cityName) {
    const response = await axios.get(`http://localhost:3000/cities?name=${cityName}`)
    return response.data;
}


export async function getPopulation(cityName) {
    const response = await axios.get(`https://catalog.skl.se/rowstore/dataset/b80d412c-9a81-4de3-a62c-724192295677?kommun=${cityName}`);
    return response.data;

}

export async function getTaxes(cityName) {
    const response = await axios.get(`https://skatteverket.entryscape.net/rowstore/dataset/c67b320b-ffee-4876-b073-dd9236cd2a99?år=2022&kommun=${cityName}`);
    return response.data;
}

export async function getKronofogdenEntries(cityName) {
    const response = await axios.get(`https://kronofogden.entryscape.net/rowstore/dataset/84b8876c-091a-4b00-a625-918060ce10b9?kommun=${cityName}`);
    return response.data;
}

//https://kronofogden.entryscape.net/rowstore/dataset/84b8876c-091a-4b00-a625-918060ce10b9?kommun=Falköping