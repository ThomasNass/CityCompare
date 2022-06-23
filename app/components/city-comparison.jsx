import react from "react";
import { FilterableTable } from "./filterable-table.jsx";
import PopulationBarChart from "./population-barchart.jsx";
import DisplayTax from "./display-tax.jsx";
import LineChart from "./line-chart.jsx";
import PieChart from "./pie-chart.jsx";
import Jobs from "./jobs.jsx";
import Button from "./button.jsx";
import Income from "./income.jsx";
import HousePrice from "./house-price.jsx";

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
                    <h1>Folkmängd 2021</h1>
                    <h4>Källa: SCB</h4>
                    <div className="bar-div">
                        <PopulationBarChart />
                    </div>
                </div>
                <div className="pie-wrapper wrapper">
                    <h1>Män / Kvinnor 2021</h1>
                    <h4>Källa: SCB</h4>
                    <div className="pie-div">
                        <PieChart
                            city={"city1"} />
                        <PieChart
                            city={"city2"} />
                    </div>
                </div>
                <div className="entries-wrapper wrapper">
                    <h1>Befolkningsförändringar</h1>
                    <h4>Källa: SCB</h4>
                    <div className="entries-div">
                        <LineChart
                        />
                    </div>
                </div>
                <div className="tax-wrapper wrapper">
                    <h1>Skattesats 2022</h1>
                    <h4>Källa: Skatteverket</h4>
                    <div className="tax-div">
                        <DisplayTax city={"city1"} />
                        <DisplayTax city={"city2"} />
                    </div>
                </div>
                <div className="tax-wrapper wrapper">
                    <h1>Snittårsinkomst 2022</h1>
                    <h4>Källa: SCB</h4>
                    <div className="tax-div">
                        <Income city={"city1"} />
                        <Income city={"city2"} />
                    </div>
                </div>
                <div className="tax-wrapper wrapper">
                    <h1>Snitthuspriser 2021</h1>
                    <h4>Källa: SCB</h4>
                    <div className="tax-div">
                        <HousePrice city={"city1"} />
                        <HousePrice city={"city2"} />
                    </div>
                </div>
                <div className="job-wrapper wrapper">
                    <h1>Lediga jobb</h1>
                    <h4>Källa: JobTech</h4>
                    <div className="job-div">
                        <Jobs
                            city={"city1"} />
                    </div>
                    <div className="job-div">
                        <Jobs
                            city={"city2"} />
                    </div>
                </div>


                <div className="table-wrapper wrapper">
                    <h1>Butiker och företag</h1>
                    <h4>Källa: hitta.se</h4>
                    <div className="table-div">
                        <Button id={"table-button"} onClick={() => this.setState({ showTable: !this.state.showTable })} text={(this.state.showTable) ? "Dölj butiker" : "Visa butiker"}></Button>
                        {(this.state.showTable)
                            ?
                            <FilterableTable
                            />
                            :
                            null
                        }
                    </div>
                </div>
            </>
        )
    }
}