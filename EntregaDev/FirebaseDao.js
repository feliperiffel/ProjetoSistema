import * as firebase from 'firebase';
var util = require('./Utils.js');
var fileSaver = require('file-saver');
var fireInstance = null;
// var test = true;

export default class FirebaseDao {

	constructor() {
		this.config = {
		    apiKey: "AIzaSyAd_8D6FxBMdYBiUpzB-fy4s7vEeMUIZ7U",
		    authDomain: "walkinginfo-6d263.firebaseapp.com",
		    databaseURL: "https://walkinginfo-6d263.firebaseio.com",
		    projectId: "walkinginfo-6d263",
		    storageBucket: "walkinginfo-6d263.appspot.com",
		    messagingSenderId: "772276627013"
		};

		firebase.initializeApp(this.config);
		firebase.auth().onAuthStateChanged(this.authStateChanged);

		this.setLogedInCallback = this.setLogedInCallback.bind(this);
		this.authStateChanged = this.authStateChanged.bind(this);
		this.createPin = this.createPin.bind(this);
		fireInstance = this;
	}

	setLogedInCallback(callback) {
		this.logedInCallback = callback;
	}

	authStateChanged(user){
		if (user){
			fireInstance.user = user;
			fireInstance.logedInCallback(user);
		} 
	}

	getCurrentUser(){
		if (!this.user) {
			let user = firebase.auth().currentUser;
			this.user = user;
		}
		return this.user;
	}

	createNewUser(email, password, callback) {
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
		  if (error) {
		  	callback(false, error.message);
		  } else {
		  	callback(true);
		  }
		});
	}

	signInUser(email, password, callback){
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  if (error) {
		  	callback(false, error.message);
		  } else {
		  	callback(true);
		  }
		});
	}

	signOutUser(callback) {
		firebase.auth().signOut().then(function() {
		  callback(true);
		}).catch(function(error) {
		  callback(false);
		});
	}

	buildBackupFile(){
		var backupJson = {}
		var ref = firebase.database().ref();
		ref.once('value', function (snap) {
		 snap.forEach(function (childSnap) {
		  	backupJson.map = childSnap.val();
		  	var blob = new Blob([JSON.stringify(backupJson)], {type: "text/plain;charset=utf-8"});
			fileSaver.saveAs(blob, "backup.json");
		 });
		});
	}

	listPins(callback){
		var pins = []
		var ref = firebase.database().ref('map/pin/');
		ref.once('value', function (snap) {
		 snap.forEach(function (childSnap) {
		 	var v = childSnap.val();
		 	v.key = childSnap.key;
		  	pins.push(v);
		 });
		 if(callback){
		 	callback(pins);
		 }
		});
	}

	firebaseRemove(key){
		var ref = firebase.database().ref('map/pin/' + key);
		ref.remove();
	}


  	readBackupFile() {
	    var input, file, fr;

	    if (typeof window.FileReader !== 'function') {
	      alert("The file API isn't supported on this browser yet.");
	      return;
	    }

	    input = document.getElementById('fileinput');
	    if (!input) {
	      alert("Um, couldn't find the fileinput element.");
	    }
	    else if (!input.files) {
	      alert("This browser doesn't seem to support the `files` property of file inputs.");
	    }
	    else if (!input.files[0]) {
	      alert("Please select a file before clicking 'Load'");
	    }
	    else {
	      file = input.files[0];
	      fr = new FileReader();
	      fr.onload = receivedText;
	      fr.readAsText(file);
	    }

	    function receivedText(e) {
	      var lines = e.target.result;
	      try{
	      	var newArr = JSON.parse(lines); 
		      if (newArr.map && newArr.map.pin){
		      	firebase.database().ref().set(newArr);	
		      	alert("Backup Restaurado.");
		      }else {
		      	alert("Arquivo de Backup Inválido!");
		      }	
	      }catch(err){
	      	alert("Arquivo de Backup Inválido!");
	      }
	      
	    }
	  }

	createPin(lat, lng, title, description){
		firebase.database().ref('map/pin/' + util.generateUUID()).set({
			lat: lat,
			lng: lng,
			title: title, 
			description: description,
			user_id: this.user.uid
		});
	}
}