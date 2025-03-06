const mongoose = require("mongoose");
require("dotenv").config()

const MONGO_URI = process.env.MONGODB_URI; 

if (!MONGO_URI) {
    console.error("❌ MONGODB_URI is not defined in environment variables!");
    process.exit(1);
}

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("✅ Connected to MongoDB");
        return mongoose.connection;
    } catch (err) {
        console.error("❌ Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB();
