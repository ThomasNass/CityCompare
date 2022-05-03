import React from "react";
import InputField from "./input-field";

export class FilterableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: ""
        }
    }


    allBuisnesses = (buisnesses1, buisnesses2) => {
        let combinedArrays = [];
        let CitiesCompared = [];
        buisnesses1.forEach(buisness => {
            combinedArrays.push(buisness.name)
        });
        buisnesses2.forEach(buisness => {
            combinedArrays.push(buisness.name)
        });

        const uniqueList = [...new Set(combinedArrays)];
        for (let i = 0; i < uniqueList.length; i++) {
            let comparison = {};
            comparison.buisness = uniqueList[i];
            comparison.buisnesses1 = "nej";
            comparison.buisnesses2 = "nej";
            buisnesses1.forEach(buisness => {
                if (buisness.name == uniqueList[i]) {
                    comparison.buisnesses1 = "ja";
                }
            });
            buisnesses2.forEach(buisness => {
                if (buisness.name == uniqueList[i]) {
                    comparison.buisnesses2 = "ja";
                }
            });
            CitiesCompared.push(comparison);
        }
        return CitiesCompared;

    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }
    filteredBuisnesses = (cities, filter) => cities.filter(city => city.buisness.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

    render() {

        const citiesCompared = this.allBuisnesses(this.props.buisnesses1, this.props.buisnesses2);
        const citiesFiltered = this.filteredBuisnesses(citiesCompared, this.state.filterText);

        return (

            <div className="Table" >
                <InputField id={"filter-field"} placeholder={"Filtrera..."} name={"filterText"} onChange={this.handleChange} />
                <table>
                    <thead>
                        <tr>
                            <td>Företag</td>
                            <td>{this.props.cityName1}</td>
                            <td>{this.props.cityName2}</td>
                        </tr>
                    </thead>
                    <tbody>

                        {citiesFiltered.map((comparison) => (
                            <tr>
                                <td>{comparison.buisness}</td>
                                {(comparison.buisnesses1 == "ja") ? <td className="green">{comparison.buisnesses1}</td> : <td className="red">{comparison.buisnesses1}</td>}
                                {(comparison.buisnesses2 == "ja") ? <td className="green">{comparison.buisnesses2}</td> : <td className="red">{comparison.buisnesses2}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )

    }

}

