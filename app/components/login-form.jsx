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

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
    }

    render() {

        return (<>
            <InputField
                placeholder={"Användarnamn"}
                type={"text"}
                name={"username"}
                value={this.state.username}
                onChange={this.handleChange} />
            <InputField
                placeholder={"Lösenord"}
                type={"password"}
                name={"password"}
                value={this.state.value}
                onChange={this.handleChange} />

            <>{(this.state.username == "Användare" && this.state.password == "Lösenord")
                ?
                <Button
                    id={"login-button"}
                    text={"Logga in"}
                    onClick={() => this.props.onClick(true)} />
                :
                <Button
                    id={"login-button"}
                    text={"Logga in"}
                    onClick={() => this.props.onClick(false)} />

            }
            </>
        </>)
    }
}