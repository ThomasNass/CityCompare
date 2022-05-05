import react from "react";
import InputField from "./input-field.jsx";
import Button from "./button.jsx";
import { getCityData, getKronofogdenApplications, getKronofogdenEvictions, getPopulation, getTaxes } from "../services/services.js";

import CityComparison from "./city-comparison.jsx";
import { unmountComponentAtNode } from "react-dom";

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
        this.setState({ remove_comparison: true });
        const city1 = await getCityData("Vetlanda");
        const city2 = await getCityData("Falköping");
        city1[0].name = search1;
        city2[0].name = search2;
        const pop1 = await getPopulation(search1);
        const pop2 = await getPopulation(search2);
        const taxes1 = await getTaxes(search1.toUpperCase());
        const taxes2 = await getTaxes(search2.toUpperCase());
        const applications1 = await getKronofogdenApplications(search1);
        const applications2 = await getKronofogdenApplications(search2);
        const evictions1 = await getKronofogdenEvictions(search1.toUpperCase());
        const evictions2 = await getKronofogdenEvictions(search2.toUpperCase());

        city1[0].kronofogdenApplications = this.getYearsAndApplications(applications1);
        city2[0].kronofogdenApplications = this.getYearsAndApplications(applications2);
        city1[0].kronofogdenEvictions = this.getEvictions(evictions1);
        city2[0].kronofogdenEvictions = this.getEvictions(evictions2);
        city1[0].tax = parseFloat(taxes1.results[0]["summa, inkl. kyrkoavgift"])
        city2[0].tax = parseFloat(taxes2.results[0]["summa, inkl. kyrkoavgift"])
        city1[0].population = parseInt(pop1.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));
        city2[0].population = parseInt(pop2.results[0]["folkmängd 31 december 2020"].replace(/ /g, ""));

        console.log(city1, city2)
        this.setState({ city1: city1 });
        this.setState({ city2: city2 });
        this.setState({ remove_comparison: false })
    }

    getEvictions = (array) => {
        const evictionsArray = [];
        array.results.forEach(eviction => {
            let obj = {};
            obj.evictions = eviction["antal genomförda vräkningar"];
            obj.applications = eviction["antal ansökningar om vräkning"];
            evictionsArray.push(obj);
        })
        return evictionsArray;
    }

    getYearsAndApplications = (array) => {
        const applicationArray = [];
        array.results.forEach(application => {
            let obj = {};
            obj.amount = application["antal ansökningar"];
            obj.year = application.år;
            applicationArray.push(obj);
        });
        return applicationArray;
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

            {(this.state.remove_comparison === false)
                ?
                <CityComparison
                    city1={this.state.city1}
                    city2={this.state.city2}
                />
                :
                null
            }
        </>)
    }
}