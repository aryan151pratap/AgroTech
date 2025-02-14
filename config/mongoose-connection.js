// const mongoose = require("mongoose");
// const dbgr = require("debug")("development:mongoose");
// const config = require("config");
// const { GridFSBucket } = require("mongodb");

// async function connectDB() {
//   try {
//     const MONGO_URI = config.get("MONGODB_URI"); // Get from config
//     const connection = await mongoose.connect(MONGO_URI, {
//       dbName: "otpdb", // 👈 Specify the database name here!
//     });

//     dbgr("✅ Connected to MongoDB");

//     const conn = connection.connection;
//     conn.once("open", () => {
//       const gfs = new GridFSBucket(conn.db, { bucketName: "videoFiles" });
//       dbgr("📂 GridFS initialized");
//     });
    

//     return conn;
//   } catch (err) {
//     dbgr("❌ MongoDB Connection Error:", err);
//     console.error("❌ Database Connection Failed:", err.message);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;

const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const MONGO_URI = config.get("MONGODB_URI");

async function connectDB() {
    try {
        await mongoose.connect(`${MONGO_URI}otpdb`);

        console.log("✅ Connected to MongoDB");

        return mongoose.connection;
    } catch (err) {
        console.log( err.message);
        process.exit(1);
    }
}
module.exports = connectDB();
