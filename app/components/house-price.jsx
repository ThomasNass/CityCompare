import react from "react";
import CityContext from "../context/city-context.js";

export default class HousePrice extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (<>
            {(isNaN(city.housePrice)) ? <p>Snittpris kunde inte hämtas</p>
                :
                <div>
                    <h2>{city.name}</h2>
                    <h2>{city.housePrice} tkr</h2>
                </div>
            }
        </>
        )
    }
}