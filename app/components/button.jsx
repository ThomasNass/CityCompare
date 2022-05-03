import react from "react";

export default class Button extends react.Component {


    render() {

        return <button id={this.props.id} onClick={this.props.onClick}>{this.props.text}</button>
    }
}