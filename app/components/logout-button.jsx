import React from "react";

export default class LogOutButton extends React.Component {


    render() {

        return <button id="logout" onClick={this.props.onClick}>Logga ut</button>
    }
}