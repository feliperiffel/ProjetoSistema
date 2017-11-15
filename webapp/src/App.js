import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import FirebaseDao from './FirebaseDao.js';

import MapComponent from './MapComponent.js';
var util = require('./Utils.js');

var $ = require('jquery');
global.jQuery = require("jquery");
window.$ = $;
var bootstrap = require('bootstrap');
var bootbox = require('bootbox');

class App extends Component {

  constructor(props) {
    super(props);

    this.firebaseDao = new FirebaseDao();
    this.state = {
      logedIn: false,
      usrEmail: "",
      usrPassword: "",
      creatingNewPin: false,
      admin: false
    };

    this.handleEmailChanged = this.handleEmailChanged.bind(this);
    this.handlePasswordChanged = this.handlePasswordChanged.bind(this);
    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.handleUserLogedIn = this.handleUserLogedIn.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleLogoutUser = this.handleLogoutUser.bind(this);
    this.handleCreatePin = this.handleCreatePin.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.changeFormLat = this.changeFormLat.bind(this);
    this.changeFormLng = this.changeFormLng.bind(this);
    this.changeFormTitle = this.changeFormTitle.bind(this);
    this.changeFormDesc = this.changeFormDesc.bind(this);
    this.handleStartPinCreation = this.handleStartPinCreation.bind(this);
    this.handleClickOnMap = this.handleClickOnMap.bind(this);
    this.handleCreateBackup = this.handleCreateBackup.bind(this);
    this.handleRestoreBackup = this.handleRestoreBackup.bind(this);
    this.handleEnterAdmin = this.handleEnterAdmin.bind(this);
    this.changeSenhaAdmin = this.changeSenhaAdmin.bind(this);

    this.firebaseDao.setLogedInCallback(this.handleUserLogedIn)

    this.createPinForm = {lat: "",
                          lng: "",
                          title: "",
                          description: ""};

    this.senhaAdmin = "";
  }

  changeSenhaAdmin(e){
      this.senhaAdmin = e.target.value;
      this.setState();
  }

  handleEnterAdmin(){
    if (this.senhaAdmin === "ADMIN"){
      this.setState({admin: true})  
    }
    this.senhaAdmin = ""
    $('#requestAdminModal').modal('hide');
  }

  handleUserLogedIn(user){
    this.setState({logedIn: true, usrEmail: user.email, admin: false});
  }

  handleEmailChanged(e){
    this.setState({usrEmail: e.target.value});
  }

  handlePasswordChanged(e){
    this.setState({usrPassword: e.target.value});
  }

  handleStartPinCreation(e){
    this.setState({creatingNewPin:true});
  }

  handleCreateBackup(e){
    this.firebaseDao.buildBackupFile();
  }

  handleRestoreBackup(e){
    this.firebaseDao.readBackupFile();
  }

  handleCancelPinCreation(e){
    this.setState({creatingNewPin:false}); 
  }

  handleClickOnMap(lat,lng){
    console.log("Click")
    if (this.state.creatingNewPin){
      this.createPinForm.lat = lat
      this.createPinForm.lng = lng
    }
  }

  handleCreatePin(){
    if (this.createPinForm.lat.length <= 0){
      bootbox.alert("Invalid Latitude");
      return;
    }
    if (this.createPinForm.lng.length <= 0){
      bootbox.alert("Invalid Longitude");
      return;
    }
    if (this.createPinForm.title.length <= 0){
      bootbox.alert("Invalid Title");
      return;
    }
    this.firebaseDao.createPin(this.createPinForm.lat, this.createPinForm.lng, this.createPinForm.title, this.createPinForm.description || "None");
    
    this.createPinForm = {lat: "",
                          lng: "",
                          title: "",
                          description: ""};
    this.setState({});
    $('#createPinModal').modal('hide')
    bootbox.alert("New Pin Sucessfully Created!");
  }

  handleCreateUser(){
    var self = this;
    this.firebaseDao.createNewUser(this.state.usrEmail, this.state.usrPassword, function(success, error){
      if (success){
        bootbox.alert("User Created");
      } else {
        bootbox.alert(error);
      }
    })
  }

  handleLogIn(){
    var self = this;
    this.firebaseDao.signInUser(this.state.usrEmail, this.state.usrPassword, function(success, error){
      if (success){
        bootbox.alert("User Signed In");
      } else {
        bootbox.alert(error);
      }
    })
  }

  handleLogoutUser(){
    var self = this;
    this.firebaseDao.signOutUser(function(success){
      if (success){
        self.setState({logedIn: false, admin: false})
      } else {
        bootbox.alert("An error occurs when try logout user.");
      }
    });
  }

  render() {
    var loginCreateContainer = "";
    if (this.state.logedIn) {

      if (this.state.creatingNewPin) {
      loginCreateContainer = 
        <div className="login_data row">
          <label className="col-sm-6">Selecione no mapa o local a ser criado o pin.</label>
          <button type="button" className="btn btn-danger col-sm-2" onClick={this.handleCancelPinCreation}>Cancelar</button>
          <button type="button" className="btn btn-default col-sm-offset-1 col-sm-2" data-toggle="modal" data-target="#createPinModal">Criar</button>
        </div>;
      } else {
        loginCreateContainer = 
          <div className="login_data row">
            <label className="col-sm-4">{this.state.usrEmail}</label>
            <button type="button" className="btn btn-danger col-sm-2" onClick={this.handleLogoutUser}>Deslogar</button>
            <button type="button" className="btn btn-default col-sm-offset-1 col-sm-2" onClick={this.handleStartPinCreation}>Criar novo pin</button>
            {this.state.admin ? 
              "" 
              : 
              <button type="button" className="btn btn-default col-sm-offset-1 col-sm-1" data-toggle="modal" data-target="#requestAdminModal">Admin</button>}
            {this.renderModal()}
          </div>;
      }

    } else {
      loginCreateContainer = 
            <div className="login_data row">
                <label className="col-sm-3">
                  email:
                  <input type="text" value={this.state.usrEmail} onChange={this.handleEmailChanged} />
                </label>
                <label className="col-sm-3">
                  senha:
                  <input type="password" value={this.state.usrPassword} onChange={this.handlePasswordChanged} />
                </label>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-default" onClick={this.handleCreateUser}>Criar Conta</button>
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-primary" onClick={this.handleLogIn}>Logar</button>
                </div>
            </div>;
    }

    var backupForm 
    if (this.state.admin) {
      backupForm = <form id="jsonFile" name="jsonFile" enctype="multipart/form-data" method="post">
              <label>Selecione o Arquivo de Backup para ser restaurado</label>
             <input type='file' id='fileinput'/>
             <button type="button" className="btn btn-default" onClick={this.handleRestoreBackup}>Restaurar Backup</button>
             <button type="button" className="btn btn-default" onClick={this.handleCreateBackup}>Criar Backup</button>
        </form>;
    }

    return (
      <div className="App">
        <div className="App-header">
          <h2>Walking Info</h2>
          <div className="login_create">
          { loginCreateContainer }
          </div>
        </div>
        <div className="main-container">
            <MapComponent 
            center={[-30.1010427,-51.2990346]}
            zoom={10}
            onClick={this.handleClickOnMap}/>
        </div>
        {backupForm}
        {this.renderAdminRequest()}
      </div>
    );
  }

  changeFormLat(e){
    this.createPinForm.lat = e.target.value;
    this.setState({});
  }

  changeFormLng(e){
    this.createPinForm.lng = e.target.value;
    this.setState({});
  }

  changeFormTitle(e){
    this.createPinForm.title = e.target.value;
    this.setState({});
  }

  changeFormDesc(e){
    this.createPinForm.description = e.target.value;
    this.setState({});
  }

  renderModal(){
    return(
      <div className="modal fade" id="createPinModal" tabIndex="-1" role="dialog" aria-labelledby="createPinModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createPinModalLabel">Create new Pin</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12">
                  <input type="text" onChange={this.changeFormLat} className="form-control col-sm-12" placeholder="Latitude...." value={this.createPinForm.lat}/>
                </div>
                <div className="col-sm-12">
                  <input type="text" onChange={this.changeFormLng} className="form-control col-sm-12" placeholder="Longitude...." value={this.createPinForm.lng}/>
                </div>
                <div className="col-sm-12">
                  <input type="text" onChange={this.changeFormTitle} className="form-control col-sm-12" placeholder="Titulo...." value={this.createPinForm.title}/>
                </div>
                <div className="col-sm-12">
                  <input type="text" onChange={this.changeFormDesc} className="form-control col-sm-12" placeholder="Descrição...." value={this.createPinForm.description}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleCreatePin}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      );
  }

  renderAdminRequest(){
    return(
      <div className="modal fade" id="requestAdminModal" tabIndex="-1" role="dialog" aria-labelledby="requestAdminModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="requestAdminModalLabel">Request Admin</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-12">
                  <input type="text" onChange={this.changeSenhaAdmin} className="form-control col-sm-12" placeholder="Senha Admin" value={this.senhaAdmin}/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
              <button type="button" className="btn btn-primary" onClick={this.handleEnterAdmin}>Entrat</button>
            </div>
          </div>
        </div>
      </div>
      );
  }
}

export default App;
