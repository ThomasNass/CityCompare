import React from "react";
import cities from '../mock-cities.json'
import SearchForm from './search-form.jsx';
import LoginForm from "./login-form.jsx";


export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: cities,
            loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false
        }
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