import react from "react";
import InputField from "./input-field.jsx";
import DataList from "./data-list.jsx";
import Button from "./button.jsx";
import { getMockCities } from "../services/api-caller.js";
import CityComparison from "./city-comparison.jsx";
import { getActualCityData, formatInput } from "../services/services.js";
import { CityProvider } from "../context/city-context.js";
import cityArray from "../cities.json";
import propTypes from "prop-types";

export default class SearchForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: "",
            city1: [],
            city2: [],
            remove_comparison: true
        }
    }


    getCities = async (search1, search2) => {
        //Sätter boolen till true ifall en jämförelse redan har gjorts för att ta bort den
        this.setState({ remove_comparison: true });

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

        this.setState({ city1 });
        this.setState({ city2 });
        this.setState({ remove_comparison: false })//Deaktiverar boolen för att en jämförelse ska kunna visas på nytt


        throw { code: "Räv", message: "Det är en räv i search-form" }

    }


    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }

    render() {
        const cities = { city1: this.state.city1, city2: this.state.city2 }//Här försöker jag lägga till cities i Context dvs CityProvider
        return (<>

            <Button
                id={"logout-button"}
                text={"Logga ut"}
                onClick={() => { this.props.saveLocalStorage(false) }} />


            <DataList type={"text"} array={cityArray.cities} className={"search-input"} name={"search1"} placeholder={"Ange stad"} onChange={this.handleChange} />
            <DataList type={"text"} array={cityArray.cities} className={"search-input"} name={"search2"} placeholder={"Ange stad"} onChange={this.handleChange} />

            <Button
                id={"compare-button"}
                text={"Jämför"}
                onClick={() => this.getCities(this.state.search1, this.state.search2)} />

            {(this.state.remove_comparison === false)
                ? <CityProvider value={cities}>
                    <CityComparison
                        city1={this.state.city1}
                        city2={this.state.city2}
                    />
                </CityProvider>
                :
                null
            }

        </>)
    }
}

SearchForm.propTypes = {
    saveLocalStorage: propTypes.func
};