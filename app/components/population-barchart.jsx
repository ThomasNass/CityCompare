import react from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context.js";



export default class PopulationBarChart extends react.Component {


    static contextType = CityContext
    render() {
        return (
            <>
                {(!isNaN(this.context.city1.population) && !isNaN(this.context.city2.population)) ?
                    <Bar
                        data={{
                            labels: [this.context.city1.name, this.context.city2.name],
                            datasets: [{
                                label: "Folkmängd",
                                backgroundColor: "pink",

                                data: [this.context.city1.population, this.context.city2.population]
                            }
                            ]
                        }}
                    />
                    :
                    <p>Kunde inte hämta populationsdata</p>
                }

            </>
        )

    }
}