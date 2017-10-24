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

    this.firebaseDao.setLogedInCallback(this.handleUserLogedIn)

    this.createPinForm = {lat: "",
                          lng: "",
                          title: "",
                          description: ""}
  }

  handleUserLogedIn(user){
    this.setState({logedIn: true, usrEmail: user.email});
  }

  handleEmailChanged(e){
    this.setState({usrEmail: e.target.value});
  }

  handlePasswordChanged(e){
    this.setState({usrPassword: e.target.value});
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
        self.setState({logedIn: false})
      } else {
        bootbox.alert("An error occurs when try logout user.");
      }
    });
  }

  render() {
    var loginCreateContainer = "";
    if (this.state.logedIn) {
      loginCreateContainer = 
        <div className="login_data row">
          <label>{this.state.usrEmail}</label>
          <button type="button" className="btn btn-danger" onClick={this.handleLogoutUser}>Logout</button>
          <button type="button" className="btn btn-default" data-toggle="modal" data-target="#createPinModal">Create Pin</button>
          {this.renderModal()}
        </div>;
    } else {
      loginCreateContainer = 
            <div className="login_data row">
                <label className="col-sm-3">
                  email:
                  <input type="text" value={this.state.usrEmail} onChange={this.handleEmailChanged} />
                </label>
                <label className="col-sm-3">
                  password:
                  <input type="password" value={this.state.usrPassword} onChange={this.handlePasswordChanged} />
                </label>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-default" onClick={this.handleCreateUser}>Create</button>
                </div>
                <div className="col-sm-3">
                  <button type="button" className="btn btn-primary" onClick={this.handleLogIn}>Login</button>
                </div>
            </div>;
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
            zoom={10}/>
        </div>
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
}

export default App;
