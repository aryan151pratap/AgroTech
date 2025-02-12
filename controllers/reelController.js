const reel = require("../models/reel");
const user = require("../models/user");

const current_user = require("../middlewares/current_user");

const open = async function(req, res){
	try{
		let fileData = await reel.find().populate("user");
		let users = await user.findOne(current_user(req.users.phonenumber));
		res.render("dashboard", { fileData , users});
	} catch (err){
		res.send(err.message);
	}
}

const create = async function(req, res){
	let error = req.flash("error");
	let users = await user.findOne(current_user(req.users.phonenumber));
	res.render("media", { error, users });
}

const video = async function(req, res){
	let {content, head} = req.body;
	if (!req.file) {
		req.flash("error", 'No file uploaded');
		return res.redirect("/reel/create");
	}

	try {
		const newFile = await reel.findOneAndUpdate(
			{ fileName: req.file.originalname },
			{
				fileName: req.file.originalname,
				fileType: req.file.mimetype,
				data: req.file.buffer,
				size: req.file.size,
				content,
				head,
				user: await user.findOne(current_user(req.users.phonenumber), { _id: 1 })
			},
			{ upsert: true, new: true }
		);
		
		res.redirect("/reel/dashboard");

	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
}

const reels = async function(req, res){
	try {
		let {url} = req.body;

		

		// https://www.youtube.com/embed/m-HcIuhIP5U?enablejsapi=1&loop=1&playlist=m-HcIuhIP5U

		// "https://www.instagram.com/reel/DFKq6GyztLM/?utm_source=ig_web_copy_link"

		// `https://www.instagram.com/reel/${url_id}/embed`;
		if(url.includes("instagram")){
			let url_id = url.split("/");
			url_id = url_id[url_id.length - 2];
			url = `https://www.instagram.com/reel/${url_id}/?utm_source=ig_embed&amp;utm_campaign=loading`;
		} else {
			let url_id = url.split("/")
			url_id = url_id[url_id.length-1].split("?")[0]
			url = `https://www.youtube.com/embed/${ url_id }?enablejsapi=1&loop=1&playlist=${ url_id }`;
		}
		


		const newFile = await reel.findOneAndUpdate(
			{ content: url }, // Query: Check if the file already exists by fileName
			{
				content: url,
				user: await user.findOne(current_user(req.users.phonenumber), { _id: 1 })
			},
			{ upsert: true, new: true } // Upsert: Create if it doesn't exist, new: Return the updated/created document
		);
		
		res.redirect("/reel/reels");

	} catch (error) {
		console.error(error);
		res.status(500).send('Server error');
	}
}

const show = async function(req, res){
	try{
		let blog = await reel.find();
		blog = blog.filter(function(items){
			return items.content.includes("https://www.youtube.com") || items.content.includes("https://www.instagram.com");
		})
		let users = await user.findOne(current_user(req.users.phonenumber));
		res.render("reels", { blog, users });
	} catch(err){
		return res.send(err.message);
	}
}


module.exports = {open, show, create, reels, video};

