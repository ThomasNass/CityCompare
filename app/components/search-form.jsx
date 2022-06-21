import react from "react";
import DataList from "./data-list.jsx";
import Button from "./button.jsx";
import CityComparison from "./city-comparison.jsx";
import CityContext from "../context/city-context.js";
import cityArray from "../cities.json";
import propTypes from "prop-types";
import MuniSelect from "./muni-select.jsx";

export default class SearchForm extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: "",
            loading: false
        }
    }

    static contextType = CityContext


    handleChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (cityArray.cities.find(element => element === value)) {
            this.setState({ [name]: value })
        }
    }

    componentDidUpdate() {
        if (this.state.loading == true) {
            if (this.context.hasCities == true) {
                this.setState({ loading: false })
            }
        }
    }

    onClick = () => {
        this.context.hasCities = false;
        if (this.state.search1.length > 0 && this.state.search2.length > 0) {
            this.setState({ loading: true })
            this.context.setContext(this.state.search1, this.state.search2)
        }

    }


    render() {
        return (<>

            <MuniSelect type={"text"} array={cityArray.cities} className={"muni-select"} name={"search1"} onChange={this.handleChange} />
            <MuniSelect type={"text"} array={cityArray.cities} className={"muni-select"} name={"search2"} onChange={this.handleChange} />

            <Button
                id={"compare-button"}
                text={"Jämför"}
                onClick={this.onClick} />
            {(this.state.loading === false) ?
                <>
                    {(this.context.hasCities === true)
                        ?
                        <CityComparison
                        />
                        :
                        null
                    }
                </> :
                <div className="loader"></div>
            }
        </>)
    }
}

SearchForm.propTypes = {
    saveLocalStorage: propTypes.func
};