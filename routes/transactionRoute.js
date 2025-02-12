const express = require("express");
const router = express.Router();
const transaction = require("../controllers/transactionController");
const isloggedin = require("../middlewares/isLoggedin");
const isSeller = require("../middlewares/isSeller");

router.get("/loan", isloggedin, transaction.loan);

router.get("/payment/:id/:amount", isloggedin, transaction.pay);

router.get("/transaction", isloggedin, transaction.tran);

router.get("/acknowledge/:buyer", isloggedin, transaction.update_tran);

router.post("/pay_sucessful/:id/:amount", isloggedin, transaction.pay_sucessful);

router.post("/get_loan", isloggedin, transaction.get_loan);

router.post("/apply", isloggedin, transaction.apply);


module.exports = router;