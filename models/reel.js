const mongoose = require("mongoose");

const reelSchema = mongoose.Schema({
	fileName: { 
		type: String, 
		required: true 
	},
    fileType: { 
		type: String, 
		required: true 
	},
    data: { 
		type: Buffer, 
		required: true 
	},
    size: { 
		type: Number, 
		required: true 
	},
	head: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	}
})

module.exports = mongoose.model("reel", reelSchema);
