import react from "react";
import SearchForm from './search-form.jsx';
import LoginForm from "./login-form.jsx";
import { ErrorView } from "../error/error-view.jsx";
import { CityProvider } from "../context/city-context.js";
// import { getIt } from "../services/api-scb.js"

export default class Page extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: JSON.parse(localStorage.getItem("loggedIn")) || false
        }
    }

    // async componentDidMount() {
    //     const thing = await getIt();
    //     console.log(thing)
    // }

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