
var util = {
	generateUUID() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	},

	runUtests(fireInstance){
		console.assert( fireInstance !== undefined, "Firebase is not being generated");

		fireInstance.setLogedInCallback(this.callbackTest)
		fireInstance.createNewUser("usr@test.com", "123456", function(acc){
			console.assert( acc, "User Not Created");

			if (acc){
				fireInstance.signOutUser(function(lgSuc){
					console.assert( acc, "User Not Loged Out");
				});
			}
		})
	},

	callbackTest(usr){
		console.assert( usr !== undefined, "Callback came without user");
	}
}

module.exports = util;