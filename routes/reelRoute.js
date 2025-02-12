const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const isloggedin = require("../middlewares/isLoggedin");
const flash = require("flash");
const {open , video, create, reels, show} = require("../controllers/reelController");
const isSeller = require("../middlewares/isSeller");


router.get("/reels" , isloggedin, show);

router.get("/create",isloggedin, create);

router.get("/dashboard", isloggedin, open);

router.post('/upload', upload.single('media'), isloggedin, video);

router.post("/blog", isloggedin, reels);

module.exports = router;