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
            console.log("I Error Boundary", this.state)
            return (
                <>
                    <p style={{ color: "white", fontSize: "2rem" }}>Ett fel har uppstått</p>
                    <p style={{ color: "white", fontSize: "2rem" }}>{this.state.errMess}</p>
                    <button onClick={() => window.location.reload()}>Ladda om</button>
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