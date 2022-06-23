import react from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class LineChart extends react.Component {

    static contextType = CityContext
    render() {
        const city1 = this.context.city1
        const city2 = this.context.city2
        return (
            <>{("growth" in city1.population && "growth" in city2.population) ?
                <div className="line-chart">
                    <Line
                        data={{
                            labels: city1.population.growth.year.map((element) => element),
                            datasets: [{
                                label: `${city1.name}`,
                                backgroundColor: "pink",
                                borderColor: "pink",
                                data: city1.population.growth.population.map((pop) => pop)
                            },
                            {
                                label: `${city2.name}`,
                                backgroundColor: "red",
                                borderColor: "red",
                                data: city2.population.growth.population.map((pop) => pop)
                            }
                            ]
                        }}
                    />
                </div>
                :
                <p>Gick ej att hämta populationsförändringar</p>
            }
            </>
        )

    }
}