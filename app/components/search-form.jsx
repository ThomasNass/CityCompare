import react from "react";
import DataList from "./data-list.jsx";
import Button from "./button.jsx";
import CityComparison from "./city-comparison.jsx";
import CityContext from "../context/city-context.js";
import cityArray from "../cities.json";
import propTypes from "prop-types";

export default class SearchForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: ""
        }
    }

    static contextType = CityContext


    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }

    render() {
        return (<>

            <DataList type={"text"} array={cityArray.cities} className={"search-input"} name={"search1"} placeholder={"Ange stad"} onChange={this.handleChange} />
            <DataList type={"text"} array={cityArray.cities} className={"search-input"} name={"search2"} placeholder={"Ange stad"} onChange={this.handleChange} />

            <Button
                id={"compare-button"}
                text={"Jämför"}
                onClick={() => this.context.setContext(this.state.search1, this.state.search2)} />

            {(this.context.hasCities === true)
                ?
                <CityComparison
                />
                :
                null
            }

        </>)
    }
}

SearchForm.propTypes = {
    saveLocalStorage: propTypes.func
};