import react from "react";

export default class BuisenessRows extends react.Component {

    render() {
        return (
            <>
                {
                    this.props.cities.map((comparison) => (
                        <tr>
                            <td>{comparison.buisness}</td>
                            {(comparison.buisnesses1 == "ja")
                                ?
                                <td className="green">{comparison.buisnesses1}</td>
                                :
                                <td className="red">{comparison.buisnesses1}</td>}
                            {(comparison.buisnesses2 == "ja")
                                ?
                                <td className="green">{comparison.buisnesses2}</td>
                                :
                                <td className="red">{comparison.buisnesses2}</td>}
                        </tr>
                    ))
                }
            </>
        )
    }
}