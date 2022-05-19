import react from "react";
import propTypes from "prop-types";

export default class Button extends react.Component {


    render() {

        return <button id={this.props.id} onClick={this.props.onClick}>{this.props.text}</button>
    }
}

Button.propTypes = {
    id: propTypes.string
}