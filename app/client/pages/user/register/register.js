import React from 'react';
import Relay from 'react-relay';
import validator from "validator";
import * as ReactBootstrap from "react-bootstrap";


import RegisterMutation from '../../../mutation/RegisterMutation';
import { ROLES, Errors } from '../../../../config';



export class RegisterPage extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor () {
    super();
    let root = this;
      this.state = {
          name: "",
          surname: "",
          mail: "",
          password: "",
          repeatPassword: "",
          hash: "",
          salt: "",
          image: "imgPreview.png",
          checkTerms: false,
          validFields: true,
          showModal: false,
          imgPreview: "imgPreview.png",
      };


  }

    showModal = () => {
        this.setState({showModal: true});
    };

    hideModal = () => {
        this.setState({showModal: false});
    };


    resetErrorSpan = () => {
        document.getElementById("spanImage").innerHTML = "";
        document.getElementById("spanName").innerHTML = "";
        document.getElementById("spanSurname").innerHTML = "";
        document.getElementById("spanMail").innerHTML = "";
        document.getElementById("spanPassword").innerHTML = "";
        document.getElementById("spanTerms").innerHTML = "";
    };

    clearFields = () => {
        this.resetErrorSpan();
        document.getElementById('imageSelected').src = "images/" + this.state.imgPreview;
        document.getElementById('form').reset();
    };

    validateFields = () => {
        if (!validator.isAlpha((document.getElementById('inputName').value).replace(/ /g, ''))) {
            this.state.validFields = false;
            document.getElementById("spanName").innerHTML = "Nombre inválido";
        }

        if (!validator.isAlpha((document.getElementById('inputSurname').value).replace(/ /g, ''))) {
            this.state.validFields = false;
            document.getElementById("spanSurname").innerHTML = "Apellido inválido";
        }

        if (!validator.isEmail(document.getElementById('inputMail').value)) {
            this.state.validFields = false;
            document.getElementById("spanMail").innerHTML = "Mail inválido";
        }

        if (document.getElementById('inputPassword').value !== document.getElementById('repeatPasswd').value) {
            this.state.validFields = false;
            document.getElementById("spanPassword").innerHTML = "Contraseñas no coinciden";
        }

        else if (!(document.getElementById('inputPassword').value.match((/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/))) || document.getElementById('inputPassword').value === "") {
            this.state.validFields = false;
            document.getElementById("spanPassword").innerHTML = "Contraseña inválida";
        }


        if (!document.getElementById('inputCheck').checked) {
            this.state.validFields = false;
            document.getElementById("spanTerms").innerHTML = "No has aceptado los términos";
        }

        if (document.getElementById('fileInput').files[0]) {
            let self = this;
            let fr = new FileReader;
            let widthImage, heightImage;
            this.state.imgPreview = document.getElementById('fileInput').files[0].name;
            fr.onload = function () {
                let img = new Image;
                img.onload = function () {
                    widthImage = img.width;
                    heightImage = img.height;
                    if (!(widthImage <= 700 && heightImage <= 700)) {
                        self.state.validFields = false;
                        document.getElementById("spanImage").innerHTML = "Imagen inválida";
                    }
                };
                img.src = fr.result;
            };
            fr.readAsDataURL(document.getElementById('fileInput').files[0]);
        }
    };

    saveRegister = () => {




        this.resetErrorSpan();
      this.state.validFields = true;
      this.validateFields();

      if (this.state.validFields && this.state.checkTerms) {

            this.showModal();

          Relay.Store.commitUpdate(
              new RegisterMutation({
                  email: this.state.mail,
                  password: this.state.password,
                  firstName: this.state.name,
                  lastName: this.state.surname,
                  image: this.state.image,
                  role: ROLES.logged,
                  user: null
              }),
              {
                  onFailure: (transaction) => {
                      console.log('Registration Failed');
                      const errorMessage = transaction.getError().source.errors[0].message;
                      const formError = {};

                      switch (errorMessage) {
                          case Errors.EmailAlreadyTaken:
                              formError.email = 'This email address is already taken. Please enter a new one.';
                              break;
                      }

                      this.refs.form.updateInputsWithError(formError);
                  },
                  onSuccess: (response) => {
                      this.context.router.push('/')

                  }
              }
          );
      }
  }



    handleChange = (event) => {
        switch (event.target.name) {
            case "name":
                this.setState({name: event.target.value});
                break;
            case "surname":
                this.setState({surname: event.target.value});
                break;
            case "mail":
                this.setState({mail: event.target.value});
                break;
            case "password":
                this.setState({password: event.target.value});
                if (event.target.value !== "") {
                    event.target.style.fontFamily = "Verdana";
                } else {
                    event.target.style.fontFamily = "Montserrat";
                }
                break;
            case "repeatPassword":
                this.setState({repeatPassword: event.target.value});
                if (event.target.value !== "") {
                    event.target.style.fontFamily = "Verdana";
                } else {
                    event.target.style.fontFamily = "Montserrat";
                }
                break;

            case "checkbox":
                if (!this.state.checkTerms)
                    this.setState({checkTerms: true});
                else
                    this.setState({checkTerms: false});
                break;
        }

    };

    previewFile = () => {
        let preview = document.getElementById('imageSelected');
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();

        reader.onloadend = function (e) {
            preview.src = e.target.result;
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    };

    HandleBrowseClick = () => {
        let fileinput = document.getElementById("fileInput");
        fileinput.click();

    };

    mouseoverPass = () => {
        document.getElementById('inputPassword').type = "text";
        document.getElementById('repeatPasswd').type = "text";

        if (document.getElementById('inputPassword').value !== "") {
            document.getElementById('inputPassword').style.fontFamily = "Montserrat";
        }
        if (document.getElementById('repeatPasswd').value !== "") {
            document.getElementById('repeatPasswd').style.fontFamily = "Montserrat";
        }
    };

    mouseoutPass = () => {
        document.getElementById('inputPassword').type = "password";
        document.getElementById('repeatPasswd').type = "password";

        if (document.getElementById('inputPassword').value !== "") {
            document.getElementById('inputPassword').style.fontFamily = "Verdana";
        }
        if (document.getElementById('repeatPasswd').value !== "") {
            document.getElementById('repeatPasswd').style.fontFamily = "Verdana";
        }
    };

  render() {
      let popover = (
          <ReactBootstrap.Popover id="popover-trigger-focus" title="La contraseña ha de contener:">
              <strong>*</strong> Mínimo 8 caracteres.<br/>
              <strong>*</strong> Letras y números.<br/>
          </ReactBootstrap.Popover>
      );

    const viewerRole = this.props.viewer.user.role;
    if (viewerRole !== ROLES.anonymous) {
      this.context.router.push('/');
      return <div/>;
    }

      return (

          <ReactBootstrap.Col lg={12} md={12} id="Register">

              <ReactBootstrap.Modal
                  {...this.props}
                  show={this.state.showModal}
                  onHide={this.hideModal}
                  dialogClassName="custom-modal">

                  <ReactBootstrap.Modal.Body>
                      <h3 id="modalText">Te hemos enviado un mail.
                          Termina tu registro de usuario cuando entres en la bandeja de entrada de tu correo. </h3>
                  </ReactBootstrap.Modal.Body>
                  <ReactBootstrap.Modal.Footer>
                      <ReactBootstrap.Button id="modalButton" onClick={this.hideModal}>Close</ReactBootstrap.Button>

                  </ReactBootstrap.Modal.Footer>
              </ReactBootstrap.Modal>

              <form id="form">
                  <h2>TUS DATOS</h2>
                  <h3>Solo necesitamos unos segundos para tener toda la información:</h3>

                  <ReactBootstrap.Row>
                      <ReactBootstrap.Col lg={12}>
                          <div>
                              <div id="imageContainer">
                                  <img src="images/imgPreview.png" id="imageSelected"/>
                              </div>
                              <input type="file" id="fileInput" onChange={this.previewFile} accept="image/*"
                                     style={{display: 'none'}}/>
                              <input type="button" value="Editar foto" id="fakeBrowse"
                                     onClick={this.HandleBrowseClick}/> <span id="spanImage"> </span>
                          </div>
                      </ReactBootstrap.Col>


                  </ReactBootstrap.Row>
                  <input onChange={this.handleChange} type="text" placeholder="Nombre" name="name"
                         id="inputName"/><span id="spanName"> </span><br/>
                  <input onChange={this.handleChange} type="text" placeholder="Apellidos" name="surname"
                         id="inputSurname"/><span id="spanSurname"> </span><br/>
                  <input onChange={this.handleChange} type="text" placeholder="Mail" name="mail" id="inputMail"/><span
                  id="spanMail"> </span><br/>

                  <ReactBootstrap.OverlayTrigger trigger="focus" placement="top" overlay={popover}>
                      <input onChange={this.handleChange} type="password" placeholder="Contraseña" name="password"
                             id="inputPassword"/>
                  </ReactBootstrap.OverlayTrigger>

                  <span id="viewPassword" onMouseOver={this.mouseoverPass} onMouseOut={this.mouseoutPass}/><span
                  id="spanPassword">ssssss </span><br/>
                  <ReactBootstrap.Row>
                      <ReactBootstrap.Col lg={6} md={12} sm={12} xs={12}>
                          <input id="repeatPasswd" onChange={this.handleChange} type="password"
                                 placeholder="Repite contraseña" name="repeatPassword"/><br/>
                          <input id="inputCheck" onChange={this.handleChange} type="checkbox" name="checkbox"/><span
                          id="terms">Lorem ipsum dolor sit amet</span><span id="spanTerms"> </span>
                      </ReactBootstrap.Col>
                      <ReactBootstrap.Col lg={6} md={12} sm={12} xs={12}>
                          <ReactBootstrap.Col lg={6} md={6} sm={6} xs={6}>
                              <ReactBootstrap.Button className="button btnClear"
                                                     onClick={this.clearFields}>Limpiar</ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                          <ReactBootstrap.Col lg={6} md={6} sm={6} xs={6}>
                              <ReactBootstrap.Button className="button btnNext"
                                                     onClick={this.saveRegister}>Siguiente</ReactBootstrap.Button>
                          </ReactBootstrap.Col>
                      </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
              </form>
          </ReactBootstrap.Col>



      );
  }
}

const container = Relay.createContainer(RegisterPage, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id,
          role,
          ${RegisterMutation.getFragment('user')}
        }
      }
    `,
  }
});

export default container;
