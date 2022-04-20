export class Table extends React.Component {


    render() {


        const noDuplicats = AllBuisnesses(this.props.city1, this.props.city2);

        return (

            <div className="page" >
                <table>
                    <thead>
                        <tr>
                            <td>Företag</td>
                            <td>Stad 1</td>
                            <td>Stad 2</td>
                        </tr>
                    </thead>
                    <tbody>

                        {noDuplicats.map((comparison) => (
                            <tr>
                                <td>{comparison.buisness}</td>
                                <td>{comparison.city1}</td>
                                <td>{comparison.city2}</td>
                            </tr>
                        ))}



                    </tbody>
                </table>
            </div>
        )

    }

}

const AllBuisnesses = (city1, city2) => {
    let combinedArrays = [];
    let CitiesCompared = [];
    city1.forEach(buisness => {
        combinedArrays.push(buisness.name)
    });
    city2.forEach(buisness => {
        combinedArrays.push(buisness.name)
    });



    const uniqueList = [...new Set(combinedArrays)];

    for (let i = 0; i < uniqueList.length; i++) {
        let comparison = {};
        comparison.buisness = uniqueList[i];
        comparison.city1 = "no";
        comparison.city2 = "no";
        city1.forEach(rest => {
            if (rest.name == uniqueList[i]) {
                comparison.city1 = "yes";
            }
        });
        city2.forEach(rest => {
            if (rest.name == uniqueList[i]) {
                comparison.city2 = "yes";
            }
        });
        CitiesCompared.push(comparison);

    }
    return CitiesCompared;

}