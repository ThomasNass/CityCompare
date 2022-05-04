import react from "react";
import InputField from "./input-field.jsx";
import Button from "./button.jsx";
import { getCityData, getKronofogdenEntries, getPopulation, getTaxes } from "../services/services.js";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationBarChart from "./population-barchart.jsx";
import DisplayTax from "./display-tax.jsx";

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
        const taxes1 = await getTaxes(search1.toUpperCase());
        const taxes2 = await getTaxes(search2.toUpperCase());
        const entries1 = await getKronofogdenEntries(search1);
        const entries2 = await getKronofogdenEntries(search2);

        console.log(entries1.results)

        const entriesArray = [];
        entries1.results.forEach(entry => {
            let obj = {};
            obj.amount = entry["antal ansökningar"];
            obj.year = entry.år;
            entriesArray.push(obj);
        });
        console.log(entriesArray);
        city1[0].kronofogdenEntries = entriesArray;

        city1[0].tax = parseFloat(taxes1.results[0]["summa, inkl. kyrkoavgift"])
        city2[0].tax = parseFloat(taxes2.results[0]["summa, inkl. kyrkoavgift"])

        city1[0].population = parseInt(pop1.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));
        city2[0].population = parseInt(pop2.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));

        console.log(city1, city2)
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
                    <PopulationBarChart
                        population1={this.state.city1[0].population}
                        population2={this.state.city2[0].population}
                        cityName1={this.state.city1[0].name}
                        cityName2={this.state.city2[0].name} />
                    <div className="tax-wrapper">
                        <h1>Skattesats 2022</h1>
                        <div className="tax-div">
                            <DisplayTax
                                tax={this.state.city1[0].tax}
                                cityName={this.state.city1[0].name} />
                            <DisplayTax
                                tax={this.state.city2[0].tax}
                                cityName={this.state.city2[0].name} />
                        </div>
                    </div>

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