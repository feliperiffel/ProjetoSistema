import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import MapComponent from './MapComponent.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Walking Info</h2>
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
