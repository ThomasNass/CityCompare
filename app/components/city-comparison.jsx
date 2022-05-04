import react from "react";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationBarChart from "./population-barchart.jsx";
import DisplayTax from "./display-tax.jsx";

export default class CityComparison extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            city1: this.props.city1,
            city2: this.props.city2
        }
    }

    render() {
        console.log(this.props.city1)
        return (
            <>
                <PopulationBarChart
                    population1={this.state.city1[0].population}
                    population2={this.state.city2[0].population}
                    cityName1={this.state.city1[0].name}
                    cityName2={this.state.city2[0].name} />
                <div className="tax-wrapper">
                    <h1>Skattesats 2022</h1>
                    <div className="tax-div">
                        <DisplayTax
                            tax={this.state.city1[0].tax}
                            cityName={this.state.city1[0].name} />
                        <DisplayTax
                            tax={this.state.city2[0].tax}
                            cityName={this.state.city2[0].name} />
                    </div>
                </div>

                <FilterableTable
                    buisnesses1={this.state.city1[0].buisness}
                    buisnesses2={this.state.city2[0].buisness}
                    cityName1={this.state.city1[0].name}
                    cityName2={this.state.city2[0].name}
                />
            </>

        )
    }
}