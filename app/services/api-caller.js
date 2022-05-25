import axios from "axios";


export async function getPopulation(cityName) {
    try {
        const response = await axios.get(`https://catalog.skl.se/rowstore/dataset/b80d412c-9a81-4de3-a62c-724192295677?kommun=${cityName}`);
        return [response.data, null];
    }
    catch (err) {
        return [null, err]
    }

}

export async function getTaxes(cityName) {
    try {
        const response = await axios.get(`https://skatteverket.entryscape.net/rowstore/dataset/c67b320b-ffee-4876-b073-dd9236cd2a99?år=2022&kommun=${cityName}`);
        return [response.data, null];
    }
    catch (err) {
        return [null, err]
    }
}

export async function getKronofogdenApplications(cityName) {
    const response = await axios.get(`https://kronofogden.entryscape.net/rowstore/dataset/84b8876c-091a-4b00-a625-918060ce10b9?kommun=${cityName}`);
    return response.data;
}

export async function getKronofogdenEvictions(cityName) {
    const response = await axios.get(`https://kronofogden.entryscape.net/rowstore/dataset/cca1e1ba-ed4d-411e-be40-abe6f4441fa7?år=2020&kommun=${cityName}`);
    return response.data;
}


export async function getJobListings(cityName) {

    try {
        const response = await axios.get(`https://links.api.jobtechdev.se/joblinks?q=${cityName}&limit=100`);
        return [response.data, null];
    }
    catch (err) {
        return [null, err]
    }
}

export async function jobsByField(occupations, cityName) {


    const response = await axios.get(`https://links.api.jobtechdev.se/joblinks?municipality=${cityName}&occupation-field=${occupations}&limit=100`);
    console.log(response)
    return response.data;


}


