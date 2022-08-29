import react from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import CityContext from "../context/city-context";



export default class ElectionMuniPieChart extends react.Component {

    static contextType = CityContext
    render() {
        const city = this.context[this.props.city]

        return (
            <>
                <div className="pie-chart">
                    <h2>{city.name}</h2>
                    {("parties" in city.electionMuniData) ?
                        <Pie
                            data={{
                                labels: city.electionMuniData.parties.map((element) => element),
                                datasets: [{
                                    label: `${this.props.cityName}`,
                                    backgroundColor: ["#1eaed6", "#57b557", "#0084ff", "#00284d", "#004d0e", "#ff2403", "#8a1503", "#fffb00", "#b0aeae"],

                                    data: city.electionMuniData.share.map((element) => element),
                                    borderWidth: 0
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