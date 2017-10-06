import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import FirebaseDao from './FirebaseDao.js';

import MapComponent from './MapComponent.js';

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
    this.firebaseDao.setLogedInCallback(this.handleUserLogedIn)
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
}

export default App;
