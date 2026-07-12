// const mongoose = require('mongoose');

// async function connectDB(uri) {
//   try {
//     await mongoose.connect(uri);
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('MongoDB connection failed:', err.message);
//     process.exit(1);
//   }
// }

// module.exports = connectDB;
const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:");
    console.error(err); // <-- print the complete error object
    process.exit(1);
  }
}

module.exports = connectDB;
