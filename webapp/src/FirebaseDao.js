import * as firebase from 'firebase';
var util = require('./Utils.js');

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

		// if (test){
		// 	test = false
		// 	util.runUtests(fireInstance);
		// }
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
		  	// var errorCode = error.code;
		  	// var errorMessage = error.message;

		  	callback(false, error.message);
		  } else {
		  	callback(true);
		  }
		});
	}

	signInUser(email, password, callback){
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		  if (error) {
		  	var errorCode = error.code;
		  	var errorMessage = error.message;	
		  	callback(false);
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