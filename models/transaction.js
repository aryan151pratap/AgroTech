const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
	
	price: {
		type: Number,
		required: true
	},
	date:{
		type: Date,
		default: Date.now
	},
	quantity: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		required: true
	},
	product: {
		type: String,
		required: true
	},
	sender_phonenumber: {
		type: String,
		required: true 
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
				ref: "user"
	}

})

module.exports = mongoose.model('transaction', transactionSchema);