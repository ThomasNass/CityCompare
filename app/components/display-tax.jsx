import react from "react";
import CityContext from "../context/city-context";

export default class DisplayTax extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (<>
            <div>
                <h2>{city.name}</h2>
                <h2>{city.tax}</h2>
            </div>
        </>
        )
    }
}