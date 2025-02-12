const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");

const shopController = require("../controllers/shopController");
const isSeller = require("../middlewares/isSeller");
const isLoggedin = require("../middlewares/isLoggedin");

router.get("/", isLoggedin, shopController.shop);

router.get("/order", isLoggedin, shopController.order_page);

router.post("/add", isLoggedin, upload.single('product_image'), shopController.add)

module.exports = router;