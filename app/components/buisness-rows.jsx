import react from "react";

export default class BuisenessRows extends react.Component {

    render() {
        return (
            <>
                {
                    this.props.cities.map((comparison) => (
                        <tr key={comparison.buisness + 1}>
                            <td key={comparison.buisness + 2}>{comparison.buisness}</td>
                            {(comparison.city1 == "ja")
                                ?
                                <td key={comparison.buisness + 3} className="green">{comparison.city1}</td>
                                :
                                <td key={comparison.buisness + 3} className="red">{comparison.city1}</td>}
                            {(comparison.city2 == "ja")
                                ?
                                <td key={comparison.buisness + 4} className="green">{comparison.city2}</td>
                                :
                                <td key={comparison.buisness + 4} className="red">{comparison.city2}</td>}
                        </tr>
                    ))
                }
            </>
        )
    }
}