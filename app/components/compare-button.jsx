import React from "react";

export default class CompareButton extends React.Component {


    render() {

        return <button id="compare-button" onClick={this.props.onClick}>Jämför</button>
    }
}