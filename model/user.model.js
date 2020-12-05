var mongoose = require("mongoose");

var userSchema =  new mongoose.Schema({
	name: String,
	username: String,
	gmail: String,
	password: String,
	avatar: String,
	friend: [String],
	information: []
});

// Status: daguiloimoi, choxacnhan, friend

var User = mongoose.model("User", userSchema);

module.exports = User;