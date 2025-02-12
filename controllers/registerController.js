const user = require("../models/user");
const { transporter } = require("../helpers/mail");
const current_user = require("../middlewares/current_user");



const register = async function(req, res){
	
	if(await user.findOne({email : req.users.phonenumber}) || await user.findOne({phonenumber : req.users.phonenumber})) return res.redirect("/reel/dashboard");

	data = req.users;
	res.render("register", {data});
}

const submit_register = async function(req, res){

	try{
		let {name, email, phonenumber, country, state, city, pincode, seller, blogger} = req.body;
		
		if(await user.findOne({phonenumber: phonenumber})) return window.alert("already exist");
		

		let created = user.create({
			name,
			email,
			phonenumber,
			country,
			state,
			city,
			pincode,
			blogger
		});
		const mailConfigurations = {
			from: 'beast152oggy@gmail.com',
			to: `${ email }`,
			subject: 'Gramid OTP',
			text: 'Register in Gramid',
			html: `<b>${name}</b><h1>You are successfully register in <b>Gramid</b></h1>
			<p>Thanks for register in Gramid </p>`
		};
		
		transporter.sendMail(mailConfigurations, function(error, info){
			if(error){
				req.flash("error", "Something went wrong!");
				return res.redirect("/users/register");
			}
		});
		if(seller == "yes"){
			return res.redirect("/users/seller");
		}
		res.redirect("/reel/dashboard");
	} catch (err){
		return res.send(err.message);
	}
}

const seller = function(req, res){
	let error = req.flash("error");
	let sucess = req.flash("sucess");
	users = req.data;
	res.render("seller", { error, sucess, users });
}

const sell = async function(req, res){
	try{
		let {upi_id, account, seller} = req.body;
		let sell = await user.findOneAndUpdate( current_user( req.users.phonenumber ),{
			QR: req.file.buffer,
			upi_id,
			account,
			seller
		})
		await sell.save();
		req.flash("sucess", "Seller added successfully!");
		res.redirect("/users/seller");

	} catch(err){
		res.send(err.message);
	}
}

const cancel = async function(req, res){
	try{
		let seller = await user.findOneAndUpdate( current_user( req.users.phonenumber ) , {seller: "no"});
		await seller.save();
		req.flash("sucess", "You are sucessfully removed!");
		res.redirect("/users/seller");
	} catch (err){
		res.send(err.message);
	}

}

const blogger_enable = async function(req, res){
	try{
		let { blogger } = req.body;
		let blog = await user.findOneAndUpdate( current_user( req.users.phonenumber ) , {blogger: blogger});
		await blog.save();
		res.redirect("/reel/dashboard");
	} catch(err){
		re.send(err.message);
	}
}



module.exports =  {register, submit_register, seller, sell, cancel, blogger_enable } ;