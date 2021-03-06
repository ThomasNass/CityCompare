import react from "react";
import SearchForm from './search-form.jsx';
import { ErrorView } from "../error/error-view.jsx";
import { CityProvider } from "../context/city-context.js";
export default class Page extends react.Component {

    render() {
        return (

            <>
                <CityProvider>
                    <ErrorView>
                        <SearchForm />
                    </ErrorView>
                </CityProvider>
            </>
        )



    }
}