import react from "react";
import propTypes from "prop-types";

//General and reusable component
//Requires a name since that is used to link the input to the datalist in the component.
//It takes an array to return options as choices to the user.
export default class DataList extends react.Component {

    render() {
        return (
            <>
                <input
                    className={this.props.className}
                    name={this.props.name}
                    type={this.props.type}
                    list={this.props.name + "-data"}
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}>

                </input>
                <datalist id={this.props.name + "-data"}>
                    {this.props.array.map((element, key) =>
                        <option key={key} value={element} />)}
                </datalist>
            </>
        )
    }

}

DataList.propTypes = {
    name: propTypes.string
}