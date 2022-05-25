import react from "react";

export class ErrorView extends react.Component {

    constructor(props) {
        super(props);
        this.state = {
            errCode: null,
            errMess: null
        }
    }

    componentDidCatch(err) {
        if (err.code && err.message) {
            this.setState({ errCode: err.code, errMess: err.message });
        }
        else {
            this.setState({ errCode: "unknown", errMess: err.toString() });
        }
    }

    render() {

        if (this.state.errCode) {
            return (
                <>
                    <p>"Unrecoverable error occured"</p>
                    <button onClick={() => window.location.reload()}>Reload page</button>
                </>
            )
        }

        return (
            <>
                {this.props.children}
            </>
        );
    }
}