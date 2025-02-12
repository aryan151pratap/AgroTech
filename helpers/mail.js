const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: 'smtp.ethereal.email',
	port: 587,
	service: "gmail",
	secure: true,
	debug: true,
	auth: {
		user: 'beast152oggy@gmail.com',
		pass: 'ydmr kxka wepj ohud'
	},
	tls: {
		rejectUnauthorized: true
	}
});



module.exports ={ transporter };