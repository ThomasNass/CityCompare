import react from "react";
import cities from "../cities.json"

export default class DataList extends react.Component {

    render() {
        return (
            <>
                <input
                    className={this.props.className || "search-input"}
                    name={this.props.name}
                    type="text"
                    list="data"
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}>

                </input>
                <datalist id="data">
                    {cities.cities.map((city, key) =>
                        <option key={key} value={city} />)}
                </datalist>
            </>
        )
    }
}