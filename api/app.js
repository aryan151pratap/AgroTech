const express = require("express");
const serverless = require("serverless-http"); // Required for Vercel
const path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public"))); // Adjust path

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

app.use(flash());

// Database Connection
const db = require("../config/mongoose-connection");

// Routes
const userRoute = require("../routes/userRoute");
const reelRoute = require("../routes/reelRoute");
const shopRoute = require("../routes/shopRoute");
const transactionRoute = require("../routes/transactionRoute");

app.use("/api/users", userRoute);
app.use("/api/reel", reelRoute);
app.use("/api/shop", shopRoute);
app.use("/api/tran", transactionRoute);

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);  // ✅ Important for Vercel
