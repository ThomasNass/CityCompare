import react from "react";
import { useState, useEffect } from "react";
import { formatInput, getActualCityData } from "../services/services.js";
import cityArray from "../cities.json"
const CityContext = react.createContext();

export const CityProvider = (props) => {
    const [city1, setCity1] = useState(null)
    const [city2, setCity2] = useState(null)
    const [hasCities, setHasCities] = useState(false)

    useEffect(() => {
        if (city1 && city2) {
            setHasCities(true)
        }
        else {
            setHasCities(false)
        }
    }, [city1, city2])

    const getCities = async (search1, search2) => {

        const city1 = {}
        const city2 = {}


        //Ändrar namnet på städerna så att de ska matcha datan som hämtas från sökningarna
        city1.name = search1;
        city2.name = search2;

        cityArray.jobMunicipality.forEach(element => {
            if (element["taxonomy/preferred-label"] == search1) {
                city1.lauCode = element["taxonomy/lau-2-code-2015"];
                city1.id = element["taxonomy/id"];
            }
            if (element["taxonomy/preferred-label"] == search2) {
                city2.lauCode = element["taxonomy/lau-2-code-2015"];
                city2.id = element["taxonomy/id"];
            }
        });
        console.log(city1, city2)
        city1.population = {}
        city2.population = {}

        await getActualCityData(city1, city2);//Här görs alla riktiga API-anrop

        setCity1(city1);
        setCity2(city2);


    }

    return (
        <CityContext.Provider value={{ city1, city2, setContext: getCities, hasCities }}>
            {props.children}
        </CityContext.Provider>
    )
}
export const CityConsumer = CityContext.Consumer

export default CityContext