const user = require("../models/user");
const jwt = require('jsonwebtoken');
const current_user = require("./current_user");

module.exports = async function(req, res, next){
	try{
		let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
		let data = await user.findOne(current_user(decoded.phonenumber)).select("seller blogger");
		req.data = data;
		next();
	} catch (err){
		res.send(err.message);
	}
}