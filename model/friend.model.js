var mongoose = require("mongoose");

var friendSchema =  new mongoose.Schema({
	id1: String,
	id2: String,
	mess: [
		{
			idAb: String,
			content: String,
			time: Date
		}
	]
});

var Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;