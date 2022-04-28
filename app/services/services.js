import axios from "axios";


const getData = (cityname) => {
    axios.get(`http://localhost:3000/cities?name=${cityname}`, {})
        .then(res => {
            const data = res.data;
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error(error)
        });
}

export async function axiosTest(cityname) {
    const response = await axios.get(`http://localhost:3000/cities?name=${cityname}`)
    return response.data;
}

export default getData;