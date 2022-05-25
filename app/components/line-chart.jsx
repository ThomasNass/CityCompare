import react from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class LineChart extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (
            <>
                <div className="line-chart">
                    <Line
                        data={{
                            labels: city.population.growth.year.map((element) => element),
                            datasets: [{
                                label: `${city.name}`,
                                backgroundColor: "pink",

                                data: city.population.growth.population.map((pop) => pop)
                            }
                            ]
                        }}
                    />
                </div>
            </>
        )

    }
}