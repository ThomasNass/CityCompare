import axios from "axios";


const getData = (cityname = "Mockköping") => {
    axios.get(`http://localhost:3000/cities?name=${cityname}`, {})
        .then(res => {
            const data = res.data;
            console.log(data);
        })
        .catch((error) => {
            console.error(error)
        });
}

export default getData;