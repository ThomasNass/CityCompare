import react from "react";


export default class DataList extends react.Component {

    render() {
        return (
            <>
                <input
                    className={this.props.className}
                    name={this.props.name}
                    type="text"
                    list="data"
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}>

                </input>
                <datalist id="data">
                    {this.props.array.map((element, key) =>
                        <option key={key} value={element} />)}
                </datalist>
            </>
        )
    }
}