import react from "react";
import cities from '../mock-cities.json'
import SearchForm from './search-form.jsx';
import LoginForm from "./login-form.jsx";
import { ErrorView } from "../error/error-view.jsx";
import { CityProvider } from "../context/city-context.js";

export default class Page extends react.Component {
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
        return (
            <>
                {(this.state.loggedIn.bool == true || this.state.loggedIn == true)
                    ? <>
                        <CityProvider>
                            <ErrorView>
                                <SearchForm saveLocalStorage={this.saveLocalStorage} />
                                {(this.context.hasCities === true)
                                    ?
                                    <CityComparison
                                    />
                                    :
                                    null
                                }
                            </ErrorView>
                        </CityProvider>
                    </>
                    : <>
                        <LoginForm onClick={this.saveLocalStorage} />
                    </>
                }

            </>)



    }
}