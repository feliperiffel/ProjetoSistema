import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import FirebaseDao from './FirebaseDao.js';

var util = require('./Utils.js');

var $ = require('jquery');
global.jQuery = require("jquery");
window.$ = $;
var bootstrap = require('bootstrap');
var bootbox = require('bootbox');

class Debug extends Component {

  constructor(props) {
    super(props);

    this.firebaseDao = new FirebaseDao();
    this.state = {
      logedIn: false,
      usrEmail: "",
      usrPassword: ""
    };

    this.enterDebugUser = this.enterDebugUser.bind(this);
    this.handleUserLogedIn = this.handleUserLogedIn.bind(this);

    this.firebaseDao.setLogedInCallback(this.handleUserLogedIn)

    this.createPinForm = {lat: "",
                          lng: "",
                          title: "",
                          description: ""};

    this.lastResults = "";

    this.first = false
  }

  enterDebugUser(e){
    this.lastResults = "";
    this.lastResults += "User Star Login Process;   ";
    this.firebaseDao.signInUser('teste@teste.com', 'teste123456')
  }

  handleUserLogedIn(e){
    this.lastResults += "User Login Complete;   ";
    this.lastResults += "Creating Pin;   ";
    this.firebaseDao.createPin(1, 1, "Teste", "Teste")
    this.setState({logedIn : true});    
    var self = this;
    window.setTimeout(function(){
        self.firebaseDao.listPins(function(pins){
          pins.forEach(function(p){
            if (p.title === 'Teste'){
              self.lastResults += "Creating Pin Completed;   ";
              self.lastResults += "Removing Pin;   ";
              self.firebaseDao.firebaseRemove(p.key);
              self.lastResults += "Removing Pin Completed;   ";
              self.setState({});
            }
          })




          self.lastResults += "User Logout;   ";
          self.firebaseDao.signOutUser(function(success){
            if (success){
              self.setState({logedIn: false})
              self.lastResults += "User Logout Completed;   ";
            } else {
              self.lastResults += "User Logout Error;   ";
            }
          });

        })
    }, 100);
  }

  render() {

    var body;
    if (this.state.logedIn){
      body = <label> Testing... </label>
    } else {
      body = <button type="button" className="btn btn-danger" onClick={this.enterDebugUser}>Start Test</button>
    }

    var r = [];
    this.lastResults.split(';').forEach(function(rr){
      r.push(<p>{rr}</p>);
    });

    return (
      <div>
        <label> Teste </label>
        {body}
        <div>
          {r}
        </div>
      </div>
    );
  }
}

export default Debug;
