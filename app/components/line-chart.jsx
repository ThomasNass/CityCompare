import react from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";



export default class LineChart extends react.Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: this.props.applications.map((application) => application.year),
            datasets: [{
                label: `${this.props.cityName}`,
                backgroundColor: "pink",

                data: this.props.applications.map((application) => application.amount)
            }
            ]
        }
    }


    render() {
        return (
            <>
                <div className="line-chart">
                    <Line
                        data={this.state}
                        options={{
                            title: {
                                display: true,
                                text: "Skuldsaneringar",
                                fontSize: 20
                            },
                            legend: {
                                display: true,
                                position: "right"
                            }
                        }} />
                </div>
            </>
        )

    }
}