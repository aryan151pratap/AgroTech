const optmodel = require("../models/otp");
const nodemailer = require("nodemailer");
const { otptime } = require("../helpers/otpvalidate");
const { transporter } = require("../helpers/mail");
const otpgenerator = require('otp-generator');
const twilio = require("twilio");
const isloggedin = require("../middlewares/isLoggedin");

const {generatetoken} = require("../utils/generate_token");

require('dotenv').config();

const acc_sid = process.env.TWILIO_SID;
const acc_token = process.env.TEILIO_TOKEN;

const twilio_client = new twilio(acc_sid, acc_token);

let entry = "";
let display = "";
display="none";

const index = function(req, res){
	let error = req.flash("error");
	res.render("index", {display, error});
}

const sendotp = async function(req, res){
	try{
		const { phonenumber } = req.body;
		entry = phonenumber;
		const otp = otpgenerator.generate(4, { upperCaseAlphabets : false, lowerCaseAlphabets: false, specialChars: false});
		const cDate =new Date();
		
		console.log("OTP ------> " + otp);

		await optmodel.findOneAndUpdate(
			{ phonenumber },
			{otp ,otpExpire: new Date(cDate.getTime())},
			{upsert: true, new: true, setDefaultsOnInsert: true}
		)


		display = "block";
		const regex = /[a-zA-Z]/;

		if(!regex.test(phonenumber)){
			console.log(entry);
			await twilio_client.messages.create({
				body: `Your OTP is: ${otp}`,
				to: entry,
				from: process.env.TWILIO_NO
			});

		} else {
			const mailConfigurations = {
				from: 'beast152oggy@gmail.com',
				to: `${ phonenumber }`,
				subject: 'Gramind OTP',
				text: 'Hello your OTP for varfication from Gramind',
				html: `<b>${otp}</b><h1>Don,t share to anyone</h1>`
			};
			  
			transporter.sendMail(mailConfigurations, function(error, info){
				if(error){
					req.flash("error", "Something went wrong!");
					return res.redirect("/users/");
				}
			});
		}
		res.redirect("/users/");
		

	} catch(err){
		console.error(err);
        res.status(500).send(err.message);
	}
}

const verifyotp = async function(req, res){
	try{

		const { otp1, otp2, otp3, otp4 } = req.body;
		const otp = otp1+otp2+otp3+otp4;
		let data = await optmodel.findOne({
			phonenumber: entry,
			otp
		});

		if(!data){
			req.flash("error", "you entered wrong otp");
			return res.redirect("/users/");
		}
		const isExpire = await otptime(data.otpExpire);

		if(isExpire){
			req.flash("error", "your otp has been expired!");
			return res.redirect("/users/");
		} 

		let token = generatetoken(data);
		res.cookie("token", token);


		res.redirect("/users/register");

	} catch(err){
		console.error(err);
        res.status(500).send(err.message);
	}
}

const profile = function(req, res){
	res.render("profile");
}


module.exports = { sendotp, index, verifyotp, profile };