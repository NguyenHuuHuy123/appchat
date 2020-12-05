var User = require("../model/user.model");

module.exports = async function(req, res, next) {
	var cookie = req.cookies.cookieAuth;
	
	if(!cookie){
		res.render("./dangnhap");
		return
	}
	var userID = await User.findOne({_id: cookie});
	if(!userID){
		res.render("./dangnhap");
		return
	}

	res.locals.idUser = req.cookies.cookieAuth;
	next();
} 