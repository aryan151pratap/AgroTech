const mongoose = require("mongoose");

const otpschema = new mongoose.Schema({
	phonenumber: { 
		type: String,
		required: true
	},
	otp: {
		type: String,
		required:true
	},
	otpExpire: {
		type: Date,
		default: Date.now,
		get: (otpExpire) => otpExpire.getTime(),
		set: (otpExpire) => new Date(otpExpire)
	}
})

module.exports = mongoose.model('otp', otpschema);