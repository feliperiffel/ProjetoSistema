import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

import './index.css';
import App from './App';
import Debug from './Debug';
import registerServiceWorker from './registerServiceWorker';

var test = window.location.href.indexOf('debug') !== -1;
if (!test){
	ReactDOM.render(<App />, document.getElementById('root'));	
} else {
	ReactDOM.render(<Debug />, document.getElementById('root'));	
}

registerServiceWorker();
