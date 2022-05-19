import react from "react";


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