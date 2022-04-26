import React from "react";

export default class Button extends React.Component {


    render() {

        return <button id={this.props.id} onClick={this.props.onClick}>{this.props.text}</button>
    }
}