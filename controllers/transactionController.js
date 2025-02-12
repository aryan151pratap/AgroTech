const user = require("../models/user");
const product = require("../models/product");
const current_user = require("../middlewares/current_user");
const transaction = require("../models/transaction");
const {transporter} = require("../helpers/mail");
const { sell } = require("./registerController");
let total_loan = 0;

const loan = async function(req, res){
	let users = await user.findOne(current_user(req.users.phonenumber), {_id: 1});
	let data = await transaction.find({ user: users._id, status: "complete", sender_phonenumber: "_" });
	let sucess = req.flash("sucess");
	res.render("getloan", {sucess, total_loan, data});
}

const pay = async function(req,res){
	try{
		let id = req.params.id;
		let amount = req.params.amount;
		let image = await product.findOne({_id: id}).populate("user");
		if(image.user.seller == "yes"){
			res.render("payment", { image, amount });
		}else{
			req.flash("error", "You are not a Seller! Fill the detail to become Seller");
			res.redirect("/users/seller");
		}
	} catch(err){
		res.send(err.message);
	}
}

const tran = async function(req, res){
	try{
		let users = await user.findOne(current_user(req.users.phonenumber));
		data = await transaction.find().populate("user", "_id name phonenumber");
		data = data.filter(p => p.user && p.user._id.toString() === users._id.toString());  // Comparing as strings
		res.render("transaction", { data });
	} catch(err){
		res.send(err.message);
	}
}

const pay_sucessful = async function(req, res){
	try{
		let pros = await product.findOne({_id: req.params.id}).populate("user", "_id phonenumber email name");
		let trans = await transaction.create({
			price: req.params.amount,
			quantity: req.params.amount / pros.price ,
			status: "pending",
			product: pros.productname,
			sender_phonenumber: "_",
			user: await user.findOne(current_user(req.users.phonenumber), {_id: 1})
		})
		const port = 3000;
		const acknowledgeUrl = `http://localhost:${port}/tran/acknowledge/${trans._id}`;

		const mailOptions = {
			from: "beast152oggy@gmail.com",
			to: `${pros.user.email}`,
			subject: "Test Email with Acknowledge Button",
			html: `<p>Hello, ${pros.name}</p>
					<p>You have a order of ${trans.product}</p>
					<h2>Quantity <b>${trans.quantity}</b></h2>
					<p>The payment has done. Have you got the payment? if you received payment than click below.</p>
					<b>Have a nice day.😎</b>
					<a href="${acknowledgeUrl}" id="acknowledgeBtn" 
					style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;" 
					onclick="disableLink(this)">
					Received
					</a>
					<p>Thank you!</p>

					<script>
					function disableLink(link) {
						link.style.pointerEvents = 'none';  // Disables the link
						link.style.opacity = '0.5';  // Visually show it's disabled
						link.innerText = 'Acknowledged';  // Change text to indicate it's clicked
					}
					</script>`,
		};

		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return res.redirect(`/tran/payment/${req.params.id}/${req.params.amount}`);
			}
		});
		res.redirect("/tran/transaction");

	} catch(err){
		res.send(err.message);
	}
	
}

const update_tran = async function(req, res){
	try{
		const { buyer } = req.params;

		let data = await transaction.findOneAndUpdate({_id : buyer}, {status: "complete"}, {new: true});

		let no = await user.findOne({_id: data.user._id }, {phonenumber: 1})

		let trans = await transaction.create({
			price: data.price,
			quantity: data.quantity,
			status: "complete",
			product: data.product,
			sender_phonenumber: no.phonenumber,
			user: await user.findOne(current_user(req.users.phonenumber), {_id: 1})
		})
		res.redirect("/tran/transaction");
	} catch(err){
		res.send(err.message);
	}
}

let mailOptions = {
	from: "",
	to: ``,
	subject: "",
	html: ``,
};

const get_loan = async function(req, res){
	let { name, email, loanTerm, accountnumber, bank} = req.body;

	let users = await user.findOne(current_user(req.users.phonenumber), {_id: 1});

	let data = await transaction.find({ user: users._id, status: "complete" });
	let total_ammount = 0;
	data.forEach(function(i){
		total_ammount+=i.price;
	})
	total_loan = total_ammount*loanTerm*0.1;

	mailOptions = {
		from: "beast152oggy@gmail.com",
		to: `${email}`,
		subject: "Test Email with Acknowledge Button",
		html: `<h1>Hello<h2/>
			   <h2>Apply for loan to ${bank}</h2>
			   <h3>name: <span>${name}</span></h3>
			   <h3>email: <span>${email}</span></h3>
			   <h3>loan Amount: <span>₹${total_loan}</span></h3>
			   <h3>loan Term: <span>${loanTerm}</span></h3>
			   <h3>Account Number: <span>${accountnumber}</span></h3>
			   `,
	};

	req.flash("sucess", "Get loan up to ");
	res.redirect("/tran/loan");
}

const apply = async function(req, res){
	try{
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				res.redirect("/tran/loan");
			}
		});
		req.flash("sucess", "Applied for loan to bank successful! ")
		res.redirect("/tran/loan");
	} catch (err){
		res.send(err.message);
	}
}

module.exports = { pay, tran, loan, pay_sucessful, update_tran, get_loan, apply };