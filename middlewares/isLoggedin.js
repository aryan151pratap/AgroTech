const otp = require("../models/otp");
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
	if(! req.cookies.token){
		req.flash("error", "you need to verify first");
		return res.redirect("/users");
	}
	try{
		let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
		let users = await otp.findOne({phonenumber: decoded.phonenumber}).select("-otp");
		req.users = users;
		next();
	}	catch (err){
		req.flash("error", "Something went wrong.");
		res.redirect("/users");
	}
}