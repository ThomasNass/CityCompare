import react from "react";
import { useState, useEffect } from "react";
import { getMockCities } from "../services/api-caller.js";
import { formatInput, getActualCityData } from "../services/services.js";
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

    getCities = async (search1, search2) => {
        //Sätter boolen till true ifall en jämförelse redan har gjorts för att ta bort den
        // this.setState({ remove_comparison: true });
        //Hämtar de hårdkodade städerna som har de hårdkodade företagen
        const city1 = await getMockCities("Vetlanda");
        const city2 = await getMockCities("Falköping");

        //Formaterar om till små bokstäver med stor i början
        search1 = formatInput(search1);
        search2 = formatInput(search2);
        //Ändrar namnet på städerna så att de ska matcha datan som hämtas från sökningarna
        city1[0].name = search1;
        city2[0].name = search2;


        await getActualCityData(city1, city2);//Här görs alla riktiga API-anrop

        setCity1(city1);
        setCity2(city2);
        // this.setState({ remove_comparison: false })//Deaktiverar boolen för att en jämförelse ska kunna visas på nytt


        // throw { code: "Räv", message: "Det är en räv i search-form" }

    }

    return (
        <CityContext.Provider value={{ city1, city2, setContext: getCities, hasCities }}>
            {props.children}
        </CityContext.Provider>
    )
}
export const CityConsumer = CityContext.Consumer

export default CityContext