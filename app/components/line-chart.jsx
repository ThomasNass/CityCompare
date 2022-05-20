import react from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class LineChart extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city][0]
        return (
            <>
                <div className="line-chart">
                    <Line
                        data={{
                            labels: city.kronofogdenApplications.map((application) => application.year),
                            datasets: [{
                                label: `${city.name}`,
                                backgroundColor: "pink",

                                data: city.kronofogdenApplications.map((application) => application.amount)
                            }
                            ]
                        }}
                    />
                </div>
            </>
        )

    }
}