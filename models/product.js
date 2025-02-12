const mongoose = require("mongoose");

const productschema = new mongoose.Schema({
	productname: {
		type: String,
		minLength: 3,
		trim: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	},
	product_image: {
		type: Buffer,
		required: true 
	},
	category: {
		type: String,
		required: true
	},
	description: String,
	discount: Number,
	user: {
		type:  mongoose.Schema.Types.ObjectId,
		ref: "user"
	}

})

module.exports = mongoose.model('product', productschema);