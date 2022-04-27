import React from "react";

export default class InputField extends React.Component {

    render() {
        return (
            <input className="search-input" type={this.props.type} onChange={(e) => this.props.onChange(e.target.value)} placeholder={this.props.placeholder}></input>
        )
    }
}