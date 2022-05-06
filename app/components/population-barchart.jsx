import react from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";



export default class PopulationBarChart extends react.Component {
    constructor(props) {
        super(props)
        this.state = {
            labels: [this.props.cityName1, this.props.cityName2],
            datasets: [{
                label: "Folkmängd",
                backgroundColor: "pink",

                data: [this.props.population1, this.props.population2]
            }
            ]
        }
    }


    render() {
        return (
            <>

                <Bar
                    data={this.state}
                />

            </>
        )

    }
}