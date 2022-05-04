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