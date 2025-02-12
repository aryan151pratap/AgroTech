const jwt = require('jsonwebtoken');

const generatetoken = (users) => {
	return jwt.sign({phonenumber: users.phonenumber, id: users._id}, process.env.JWT_KEY);
}

module.exports.generatetoken = generatetoken;