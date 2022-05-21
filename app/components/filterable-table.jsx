import react from "react";
import BuisenessRows from "./buisness-rows";
import InputField from "./input-field";
import { getBuiseness, getBuisnesses } from "../services/services.js";
import CityContext from "../context/city-context.js";
import Button from "./button";

export class FilterableTable extends react.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: "",
            search: "",
            citiesCompared: [],
            extraComparison: [],
            done: false,
            extra: false,
        }
    }


    // allBuisnesses = (buisnesses1, buisnesses2) => {
    //     let combinedArrays = [];
    //     let CitiesCompared = [];
    //     buisnesses1.forEach(buisness => {
    //         combinedArrays.push(buisness.name)
    //     });
    //     buisnesses2.forEach(buisness => {
    //         combinedArrays.push(buisness.name)
    //     });

    //     const uniqueList = [...new Set(combinedArrays)];
    //     for (let i = 0; i < uniqueList.length; i++) {
    //         let comparison = {};
    //         comparison.buisness = uniqueList[i];
    //         comparison.buisnesses1 = "nej";
    //         comparison.buisnesses2 = "nej";
    //         buisnesses1.forEach(buisness => {
    //             if (buisness.name == uniqueList[i]) {
    //                 comparison.buisnesses1 = "ja";
    //             }
    //         });
    //         buisnesses2.forEach(buisness => {
    //             if (buisness.name == uniqueList[i]) {
    //                 comparison.buisnesses2 = "ja";
    //             }
    //         });
    //         CitiesCompared.push(comparison);
    //     }
    //     return CitiesCompared;

    // }

    async componentDidMount() {
        const citiesCompared = await getBuisnesses(this.context.city1[0].name.toLowerCase(), this.context.city2[0].name.toLowerCase());
        this.setState({ citiesCompared })
        this.setState({ done: true })
    }

    extraSearch = async () => {
        if (!this.state.extraComparison.some(
            e => e.buisness ===
                this.state.search
        )) {
            const extra = await getBuiseness(this.context.city1[0].name.toLowerCase(), this.context.city2[0].name.toLowerCase(), this.state.search);
            const extraComparison = this.state.extraComparison.concat(extra);
            this.setState({ extraComparison })
            this.setState({ extra: true })
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }
    filteredBuisnesses = (cities, filter) => cities.filter(city => city.buisness.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    static contextType = CityContext
    render() {

        let citiesFiltered;
        if (this.state.done) {
            citiesFiltered = this.filteredBuisnesses(this.state.citiesCompared, this.state.filterText);
        }
        return (
            <>
                {this.state.done ?
                    <>
                        <div className="Table" >
                            <InputField className={"filter-input"} placeholder={"Filtrera tabell.."} name={"filterText"} onChange={this.handleChange} />
                            <table>
                                <thead>
                                    <tr>
                                        <td>Företag</td>
                                        <td>{this.context.city1[0].name}</td>
                                        <td>{this.context.city2[0].name}</td>
                                    </tr>
                                </thead>
                                <tbody>

                                    <BuisenessRows cities={citiesFiltered} />
                                </tbody>
                            </table>

                        </div>
                        <div id="extra-seach-div">
                            <InputField className={"extra-search-input"} placeholder={"Saknar du något?"} name={"search"} onChange={this.handleChange} />
                            <Button id={"extra-search-button"} text={"Sök"} onClick={this.extraSearch} /></div>
                        {this.state.extra ?
                            <div className="Table">
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Extra jämförelse</td>
                                            <td>{this.context.city1[0].name}</td>
                                            <td>{this.context.city2[0].name}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <BuisenessRows cities={this.state.extraComparison} />
                                    </tbody>
                                </table>
                            </div>
                            :
                            <p>Extra sökningar</p>
                        }


                    </>
                    :
                    <p>
                        Rendering..
                    </p>


                }       </>)

    }

}

