import react from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";



export default class PieChart extends react.Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: ["Vräkningar", "Vräkningsansökningar"],
            datasets: [{
                label: `${this.props.cityName}`,
                backgroundColor: ["red", "pink"],

                data: [this.props.evictions[0].evictions, this.props.evictions[0].applications]
            }
            ]
        }
    }


    render() {
        return (
            <>
                <div className="pie-chart">
                    <h2>{this.props.cityName}</h2>
                    {(this.props.evictions[0].evictions > 0 || this.props.evictions[0].applications > 0) ?
                        <Pie
                            data={this.state}
                        /> :
                        <h2>I {this.props.cityName} gjordes inga vräkningar eller vräkningsansökningar</h2>}
                </div>
            </>
        )

    }
}