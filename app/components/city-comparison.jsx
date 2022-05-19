import react from "react";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationBarChart from "./population-barchart.jsx";
import DisplayTax from "./display-tax.jsx";
import LineChart from "./line-chart.jsx";
import PieChart from "./pie-chart.jsx";
import Jobs from "./jobs.jsx";
import Button from "./button.jsx";

export default class CityComparison extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTable: false
        }
    }


    render() {
        return (

            <>
                <div className="bar-wrapper wrapper">
                    <h1>Folkmängd 2020</h1>
                    <div className="bar-div">
                        <PopulationBarChart />
                    </div>
                </div>
                <div className="tax-wrapper wrapper">
                    <h1>Skattesats 2022</h1>
                    <div className="tax-div">
                        <DisplayTax
                            tax={this.props.city1[0].tax}
                            cityName={this.props.city1[0].name} />
                        <DisplayTax
                            tax={this.props.city2[0].tax}
                            cityName={this.props.city2[0].name} />
                    </div>
                </div>
                <div className="job-wrapper wrapper">
                    <h1>Lediga jobb</h1>
                    <div className="job-div">
                        <Jobs
                            jobs={this.props.city1[0].jobs}
                            cityName={this.props.city1[0].name} />
                    </div>
                    <div className="job-div">
                        <Jobs
                            jobs={this.props.city2[0].jobs}
                            cityName={this.props.city2[0].name} />
                    </div>
                </div>
                <div className="entries-wrapper wrapper">
                    <h1>Skuldsaneringsansökningar till kronofogden</h1>
                    <div className="entries-div">
                        <LineChart
                            cityName={this.props.city1[0].name}
                            applications={this.props.city1[0].kronofogdenApplications} />
                        <LineChart
                            cityName={this.props.city2[0].name}
                            applications={this.props.city2[0].kronofogdenApplications} />
                    </div>
                </div>
                <div className="pie-wrapper wrapper">
                    <h1>Vräkningar / Vräkningsansökningar 2020</h1>
                    <div className="pie-div">
                        <PieChart
                            evictions={this.props.city1[0].kronofogdenEvictions}
                            cityName={this.props.city1[0].name} />
                        <PieChart
                            evictions={this.props.city2[0].kronofogdenEvictions}
                            cityName={this.props.city2[0].name} />
                    </div>
                </div>
                <>
                    <Button id={"job-button"} onClick={() => this.setState({ showTable: !this.state.showTable })} text={(this.state.showTable) ? "Dölj butiker" : "Visa butiker"}></Button>
                    {(this.state.showTable)
                        ?
                        <FilterableTable
                            buisnesses1={this.props.city1[0].buisness}
                            buisnesses2={this.props.city2[0].buisness}
                            cityName1={this.props.city1[0].name}
                            cityName2={this.props.city2[0].name}
                        />
                        :
                        null
                    }
                </>
            </>
        )
    }
}