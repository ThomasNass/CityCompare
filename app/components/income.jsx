import react from "react";
import CityContext from "../context/city-context.js";

export default class Income extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (<>
            {(isNaN(city.income.average || city.income.median)) ? <p>Inkomster kunde inte hämtas</p>
                :
                <div>
                    <h2>{city.name}</h2>
                    <h2>Medel: {city.income.average} tkr</h2>
                    <h2>Median: {city.income.median} tkr</h2>
                </div>
            }
        </>
        )
    }
}