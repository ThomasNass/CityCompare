import react from "react";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationBarChart from "./population-barchart.jsx";
import DisplayTax from "./display-tax.jsx";
import LineChart from "./line-chart.jsx";
import PieChart from "./pie-chart.jsx";

export default class CityComparison extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            city1: this.props.city1,
            city2: this.props.city2
        }
    }

    render() {
        return (

            <>
                <div className="bar-wrapper wrapper">
                    <h1>Folkmängd 2020</h1>
                    <div className="bar-div">
                        <PopulationBarChart
                            population1={this.state.city1[0].population}
                            population2={this.state.city2[0].population}
                            cityName1={this.state.city1[0].name}
                            cityName2={this.state.city2[0].name} />
                    </div>
                </div>
                <div className="tax-wrapper wrapper">
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
                <div className="entries-wrapper wrapper">
                    <h1>Skuldsaneringsansökningar till kronofogden</h1>
                    <div className="entries-div">
                        <LineChart
                            cityName={this.state.city1[0].name}
                            applications={this.state.city1[0].kronofogdenApplications} />
                        <LineChart
                            cityName={this.state.city2[0].name}
                            applications={this.state.city2[0].kronofogdenApplications} />
                    </div>
                </div>
                <div className="pie-wrapper wrapper">
                    <h1>Vräkningar / Vräkningsansökningar 2020</h1>
                    <div className="pie-div">
                        {
                            <PieChart
                                evictions={this.state.city1[0].kronofogdenEvictions}
                                cityName={this.state.city1[0].name} />
                        }
                        <PieChart
                            evictions={this.state.city2[0].kronofogdenEvictions}
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