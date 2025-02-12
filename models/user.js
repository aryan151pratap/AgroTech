const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		trim: true
	},
	email: String,
	phonenumber: String,
	country: String,
	state: String,
	city: String,
	pincode: Number,
	reel: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "reel"
	}],
	seller:{
		type: String,
		default: "no"
	},
	blogger:{
		type: String,
		default: "no"
	},
	upi_id:{
		type: String
	},
	QR: {
		type: Buffer
	},
	account: String,
	transaction: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "transaction"
	}],
	product: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "product"
	}]
})

module.exports = mongoose.model('user', userschema);