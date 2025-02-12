const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const registers = require("../controllers/registerController");
const isloggedin = require("../middlewares/isLoggedin");
const upload = require("../config/multer-config");
const isSeller = require("../middlewares/isSeller");



// get request
router.get("/", controller.index);


router.get("/register",isloggedin ,registers.register);

router.get("/logout", function(req, res){
	res.cookie("token", "");
	res.redirect("/users/");
})

router.get("/seller", isloggedin, isSeller, registers.seller);

router.get("/profile", isloggedin, controller.profile);



// post request
router.post("/send-otp", controller.sendotp);
router.post("/verify-otp", controller.verifyotp);

router.post("/submit",isloggedin ,registers.submit_register);

router.post("/sell", upload.single('QR'), isloggedin, registers.sell);
router.post("/cancel", isloggedin, registers.cancel);

router.post("/blogger", isloggedin, registers.blogger_enable);

module.exports = router;