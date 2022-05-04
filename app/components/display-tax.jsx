import react from "react";

export default class DisplayTax extends react.Component {

    render() {
        return (
            <div>
                <h2>{this.props.cityName}</h2>
                <h2>{this.props.tax}</h2>
            </div>
        )
    }
}