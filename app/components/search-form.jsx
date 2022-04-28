import React from "react";
import InputField from "./input-field.jsx";
import Button from "./button.jsx";
import getData from "../services/services.js"
import { axiosTest } from "../services/services.js";
import { Table } from "./table.jsx";

export default class SearchForm extends React.Component {
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
        const city1 = await axiosTest(search1);
        const city2 = await axiosTest(search2);

        this.setState({ city1: city1 });
        this.setState({ city2: city2 }, () => console.log(this.state))
    }

    render() {

        return (<>
            <Button id={"logout-button"} text={"Logga ut"} onClick={() => { this.props.saveLocalStorage(false); this.props.onClick("", ""); }} />
            <InputField placeholder={"Mockholm"} onChange={(search1) => this.setState({ search1 })} />
            <InputField placeholder={"Mockköping"} onChange={(search2) => this.setState({ search2 })} />
            <Button id={"compare-button"} text={"Jämför"} onClick={() => this.getCities(this.state.search1, this.state.search2)} />
            {(this.state.city1.length > 0 && this.state.city2.length > 0)
                ?
                <Table buisnesses1={this.state.city1[0].buisness} cityName1={this.state.city1[0].name} buisnesses2={this.state.city2[0].buisness} cityName2={this.state.city2[0].name} />
                :
                null
            }
        </>)
    }
}