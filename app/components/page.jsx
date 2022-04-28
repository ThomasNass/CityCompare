import React from "react";
import cities from '../mock-cities.json'
import { Table } from './table.jsx';
import SearchForm from './search-form.jsx';
import LoginForm from "./login-form.jsx";


export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: cities,
            search1: "",
            search2: "",
            loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false
        }
    }

    onClick = (search1, search2) => {
        this.setState({ search1: search1 })
        this.setState({ search2: search2 })
    }


    saveLocalStorage = (loggedIn) => {
        this.setState({ loggedIn: loggedIn }, () => {
            localStorage.setItem("loggedIn", JSON.stringify({ bool: loggedIn }))
        })

    }



    render() {
        return <>
            {(this.state.loggedIn.bool == true || this.state.loggedIn == true)
                ? <>
                    <SearchForm onClick={this.onClick} saveLocalStorage={this.saveLocalStorage} />
                </>
                : <>
                    <LoginForm onClick={this.saveLocalStorage} />
                </>
            }
        </>


    }
}