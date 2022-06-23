import react from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class PieChart extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        let menPercent;
        let womenPercent;
        if (city.population.men > 0 || city.population.fem > 0) {
            menPercent = Math.round((city.population.men / city.population.total) * 100)
            womenPercent = Math.round((city.population.fem / city.population.total) * 100)

        }
        return (
            <>
                <div className="pie-chart">
                    <h2>{city.name}</h2>
                    {(city.population.men > 0 || city.population.fem > 0) ?
                        <Pie
                            data={{
                                labels: [`Män ${menPercent}%`, `Kvinnor ${womenPercent}%`],
                                datasets: [{
                                    label: `${this.props.cityName}`,
                                    backgroundColor: ["red", "pink"],

                                    data: [city.population.men, city.population.fem]
                                }
                                ]
                            }}
                        /> :
                        <h2>Gick ej att hämta data</h2>}
                </div>
            </>
        )

    }
}