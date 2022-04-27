import React from "react";
import InputField from "./input-field.jsx";
import Button from "./button.jsx";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    render() {

        return (<>
            <InputField placeholder={"Användarnamn"} type={"text"} onChange={(username) => this.setState({ username })} />
            <InputField placeholder={"Lösenord"} type={"password"} onChange={(password) => this.setState({ password })} />
            <>{(this.state.username == "Användare" && this.state.password == "Lösenord")
                ?
                <Button id={"login-button"} text={"Logga in"} onClick={() => this.props.onClick(true)} />
                :
                <Button id={"login-button"} text={"Logga in"} onClick={() => this.props.onClick(false)} />

            }
            </>
        </>)
    }
}