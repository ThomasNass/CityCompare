import axios from "axios";

export async function getCityData(cityName) {
    const response = await axios.get(`http://localhost:3000/cities?name=${cityName}`)
    return response.data;
}


export async function getPopulation(cityName) {
    const response = await axios.get(`https://catalog.skl.se/rowstore/dataset/b80d412c-9a81-4de3-a62c-724192295677?kommun=${cityName}`);
    return response.data;

}