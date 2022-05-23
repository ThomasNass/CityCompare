import react from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class PieChart extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]
        return (
            <>
                <div className="pie-chart">
                    <h2>{city.name}</h2>
                    {(city.kronofogdenEvictions[0].evictions > 0 || city.kronofogdenEvictions[0].applications > 0) ?
                        <Pie
                            data={{
                                labels: ["Vräkningar", "Vräkningsansökningar"],
                                datasets: [{
                                    label: `${this.props.cityName}`,
                                    backgroundColor: ["red", "pink"],

                                    data: [city.kronofogdenEvictions[0].evictions, city.kronofogdenEvictions[0].applications]
                                }
                                ]
                            }}
                        /> :
                        <h2>I {city.name} gjordes inga vräkningar eller vräkningsansökningar</h2>}
                </div>
            </>
        )

    }
}