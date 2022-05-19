import propTypes from "prop-types";
import react from "react";

export default class InputField extends react.Component {

    render() {
        return (
            <input
                className={this.props.className || "search-input"}
                value={this.props.value}
                name={this.props.name}
                type={this.props.type}
                onChange={this.props.onChange}
                placeholder={this.props.placeholder}>

            </input>
        )
    }
}

InputField.propTypes = {
    name: propTypes.string
}