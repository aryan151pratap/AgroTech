const user = require("../models/user");
const product = require("../models/product");
const current_user = require("../middlewares/current_user");

const shop = async function(req, res){
	let data = await product.find().populate("user");
	data = data.filter(p => p.user && p.user.seller === "yes");
	res.render("store", {data});
}

const order_page = function(req, res){
	let data = { phonenumber: "134y98123835"};
	res.render("order", {data});
}


const add = async function(req, res){
	let { productname, price, quantity, category, description } = req.body;
	try {
		let foundUser = await user.findOne(current_user(req.users.phonenumber));
		const userId = foundUser ? foundUser._id : null;
		const pro = await product.create({
			product_image: req.file.buffer,
			productname,
			price,
			quantity,
			category,
			description,
			user: userId
		})
		foundUser.product.push(pro._id);
		await foundUser.save();
		

		res.redirect("/shop/");

	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
}

module.exports = { shop, add, order_page};