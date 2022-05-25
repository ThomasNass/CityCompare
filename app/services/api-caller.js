import axios from "axios";


export async function getTaxes(cityName) {
    try {
        const response = await axios.get(`https://skatteverket.entryscape.net/rowstore/dataset/c67b320b-ffee-4876-b073-dd9236cd2a99?år=2022&kommun=${cityName}`);
        return [response.data, null];
    }
    catch (err) {
        return [null, err]
    }
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
    return response.data;


}


