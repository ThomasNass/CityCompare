import React from "react";
import cities from '../mock-cities.json'
import { Table } from './table.jsx';
import SearchForm from './search-form.jsx';

export default class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: cities,
            search1: "",
            search2: "",
            username: "",
            password: "",
            loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false
        }
    }

    onClick = (search1, search2) => {
        this.setState({ search1: search1 })
        this.setState({ search2: search2 })
    }

    onChangeName = (e) => {
        this.setState({ username: e.target.value })
    }
    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }


    saveLocalStorage = (loggedIn) => {
        this.setState({ loggedIn: loggedIn }, () => {
            localStorage.setItem("loggedIn", JSON.stringify({ bool: loggedIn }))
        })

    }


    render() {
        const town1 = this.state.cities[0].City;
        const town2 = this.state.cities[1].City;
        const buisnesses1 = town1[1].buisness;
        const buisnesses2 = town2[1].buisness;
        console.log(this.state.loggedIn);
        return <>
            {(this.state.loggedIn.bool == true || this.state.loggedIn == true)
                ? <>
                    <SearchForm town1={town1} town2={town2} onClick={this.onClick} saveLocalStorage={this.saveLocalStorage} />

                    {(this.state.search1 == "Mockholm" && this.state.search2 == "Mockköping")
                        ?
                        <Table buisnesses1={buisnesses1} buisnesses2={buisnesses2} cityName1={this.state.search1} cityName2={this.state.search2} />
                        :
                        null
                    }
                </>
                : <>
                    <input type="text" placeholder="användarnamn" onChange={this.onChangeName} value={this.state.username}></input>
                    <input type="password" placeholder="lösenord" onChange={this.onChangePassword} value={this.state.password} ></input>
                    <>{(this.state.username == "Användare" && this.state.password == "Lösenord")
                        ?
                        <button onClick={() => this.saveLocalStorage(true)}> Logga in</button>
                        :
                        <button onClick={() => this.saveLocalStorage(false)} > Logga in</button>
                    }
                    </>
                </>
            }
        </>


    }
}