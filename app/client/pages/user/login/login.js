import React from "react";
import Relay from "react-relay";
import {browserHistory} from "react-router";
import Formsy from "formsy-react";
import {FormsyText} from "formsy-material-ui";
import RaisedButton from "material-ui/RaisedButton";

import LoginMutation from "../../../mutation/LoginMutation";
import {Errors, ROLES} from "../../../../config";



export class LoginPage extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired,
    };

    login(user, model) {
        const self = this;
        Relay.Store.commitUpdate(
            new LoginMutation({
                email: model.email,
                password: model.password,
                user: user
            }),
            {
                onFailure: (transaction) => {
                    console.log('login failed');
                    console.log(transaction.getError().source);
                    const errorMessage = transaction.getError().source.errors[0].message;
                    const formError = {};

                    switch (errorMessage) {
                        case Errors.WrongEmailOrPassword:
                            formError.email = 'Email or password is incorrect';
                            formError.password = 'Email or password is incorrect';
                            break;
                    }

                    this.refs.form.updateInputsWithError(formError);
                },
                onSuccess: (response) => {
                    this.context.router.push('/user')
                }
            }
        );
    }

    render() {
        const viewerRole = this.props.viewer.user.role;
        if (viewerRole !== ROLES.anonymous) {
            this.context.router.push('/user');
            return <div/>;
        }

        const submitMargin = {marginTop: 20};

        return (
            <div>
              <h2>Login</h2>

              <Formsy.Form
                  ref="form"
                  onSubmit={(model) => this.login(this.props.viewer.user, model)}
              >

                <FormsyText
                    name="email"
                    floatingLabelText="E-Mail"
                    fullWidth={true}
                    validations="isEmail"
                    validationError="Please enter a valid email address"/>

                <FormsyText
                    name="password"
                    type="password"
                    floatingLabelText="Passwort"
                    fullWidth={true}/>

                <RaisedButton
                    type="submit"
                    label="Login"
                    secondary={true}
                    fullWidth={true}/>

                <RaisedButton
                    label="Register"
                    primary={true}
                    fullWidth={true}
                    onClick={() => this.context.router.push('/register')}/>

              </Formsy.Form>

            </div>
        );
    }
}

const container = Relay.createContainer(LoginPage, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                user {
                    id,
                    role,
                    ${LoginMutation.getFragment('user')}
                }
            }
        `,
    }
});

export default container;
