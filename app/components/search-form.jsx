import react from "react";
import InputField from "./input-field.jsx";
import Button from "./button.jsx";
import { getCityData, getPopulation } from "../services/services.js";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationChart from "./population-chart.jsx";

export default class SearchForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: "",
            city1: [],
            city2: []
        }
    }

    getCities = async (search1, search2) => {
        const city1 = await getCityData(search1);
        const city2 = await getCityData(search2);
        const pop1 = await getPopulation(search1);
        const pop2 = await getPopulation(search2);

        city1[0].population = Object.values(pop1.results[0]).at(1);
        city2[0].population = Object.values(pop2.results[0]).at(1);

        this.setState({ city1: city1 });
        this.setState({ city2: city2 });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }

    render() {

        return (<>
            <Button
                id={"logout-button"}
                text={"Logga ut"}
                onClick={() => { this.props.saveLocalStorage(false) }} />
            <InputField
                name={"search1"}
                value={this.state.search1}
                placeholder={"Falköping"}
                onChange={this.handleChange} />
            <InputField
                name={"search2"}
                value={this.state.search2}
                placeholder={"Vetlanda"}
                onChange={this.handleChange} />
            <Button
                id={"compare-button"}
                text={"Jämför"}
                onClick={() => this.getCities(this.state.search1, this.state.search2)} />

            {(this.state.city1.length > 0 && this.state.city2.length > 0)
                ?
                <>
                    <PopulationChart
                        population1={this.state.city1[0].population}
                        Population2={this.state.city2[0].population}
                        cityName1={this.state.city1[0].name}
                        cityName2={this.state.city2[0].name} />
                    <FilterableTable
                        buisnesses1={this.state.city1[0].buisness}
                        buisnesses2={this.state.city2[0].buisness}
                        cityName1={this.state.city1[0].name}
                        cityName2={this.state.city2[0].name}
                    />
                </>
                :
                null
            }
        </>)
    }
}