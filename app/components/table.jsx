import React from "react";

export class Table extends React.Component {

    render() {

        const CitiesCompared = AllBuisnesses(this.props.buisnesses1, this.props.buisnesses2);

        return (

            <div className="Table" >
                <table>
                    <thead>
                        <tr>
                            <td>Företag</td>
                            <td>{this.props.cityName1}</td>
                            <td>{this.props.cityName2}</td>
                        </tr>
                    </thead>
                    <tbody>

                        {CitiesCompared.map((comparison) => (
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

const AllBuisnesses = (buisnesses1, buisnesses2) => {
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
        buisnesses1.forEach(rest => {
            if (rest.name == uniqueList[i]) {
                comparison.buisnesses1 = "ja";
            }
        });
        buisnesses2.forEach(rest => {
            if (rest.name == uniqueList[i]) {
                comparison.buisnesses2 = "ja";
            }
        });
        CitiesCompared.push(comparison);

    }
    return CitiesCompared;

}