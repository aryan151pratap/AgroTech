const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const MONGO_URI = config.get("MONGODB_URI");

async function connectDB() {
    try {
        await mongoose.connect(`${MONGO_URI}otpdb`, { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("✅ Connected to MongoDB");

        return mongoose.connection;
    } catch (err) {
        console.log(err.message);
        process.exit(1); 
    }
}

module.exports = connectDB();
