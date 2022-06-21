import react from "react";


//General and reusable component
//Requires a name since that is used to link the input to the datalist in the component.
//It takes an array to return options as choices to the user.
export default class MuniSelect extends react.Component {

    render() {
        return (
            <>
                <select
                    className={this.props.className}
                    name={this.props.name}
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                    required>
                    <option value={""} disabled selected>Välj stad</option>
                    {this.props.array.map((element, key) =>
                        <option key={key} value={element}>{element}</option>)}
                </select>



            </>
        )
    }

}
