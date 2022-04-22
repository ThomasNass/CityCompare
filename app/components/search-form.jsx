import React from "react";
import CompareButton from "./compare-button.jsx";
import SearchField from "./search-field.jsx";
import LogOutButton from "./logout-button.jsx";

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search1: "",
            search2: ""
        }
    }

    render() {
        const town1 = this.props.town1;
        const town2 = this.props.town2;

        return (<>
            <LogOutButton onClick={() => { this.props.saveLocalStorage(false); this.props.onClick("", ""); }} />
            <SearchField city={town1[0].name} onChange={(search1) => this.setState({ search1 })} />
            <SearchField city={town2[0].name} onChange={(search2) => this.setState({ search2 })} />
            <CompareButton onClick={() => this.props.onClick(this.state.search1, this.state.search2)} />
        </>)
    }
}