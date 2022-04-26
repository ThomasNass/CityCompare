import React from "react";
import SearchField from "./search-field.jsx";
import Button from "./button.jsx";

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: ""
        }
    }

    render() {

        return (<>
            <Button id={"logout"} text={"Logga ut"} onClick={() => { this.props.saveLocalStorage(false); this.props.onClick("", ""); }} />
            <SearchField placeholder={"Mockholm"} onChange={(search1) => this.setState({ search1 })} />
            <SearchField placeholder={"Mockköping"} onChange={(search2) => this.setState({ search2 })} />
            <Button id={"compare-button"} text={"Jämför"} onClick={() => this.props.onClick(this.state.search1, this.state.search2)} />
        </>)
    }
}