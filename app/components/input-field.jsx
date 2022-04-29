import React from "react";

export default class InputField extends React.Component {

    render() {
        return (
            <input className="search-input" value={this.props.value} name={this.props.name} type={this.props.type} onChange={this.props.onChange} placeholder={this.props.placeholder}></input>
        )
    }
}