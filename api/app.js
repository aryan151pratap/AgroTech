const express = require("express");
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require("connect-flash");
const expressSession = require("express-session");

const userRoute = require("../routes/userRoute");
const reelRoute = require("../routes/reelRoute");
const shopRoute = require('../routes/shopRoute');
const transactionRoute = require("../routes/transactionRoute");


require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
	expressSession({
		resave: false,
		saveUninitialized: false,
		secret: process.env.EXPRESS_SESSION_SECRET,
	})
);

app.use(flash());

const db = require("../config/mongoose-connection");


app.use('/users', userRoute);
app.use("/reel", reelRoute);
app.use("/shop", shopRoute);
app.use("/tran", transactionRoute);


const port = process.env.SERVER_PORT | 3000;
app.listen(port, '0.0.0.0', function(){
    console.log("Server listen on port " + port);
});