import React from "react";

export default class SearchField extends React.Component {

    render() {
        return (
            <input id="search-input" onChange={(e) => this.props.onChange(e.target.value)} placeholder={this.props.placeholder}></input>
        )
    }
}