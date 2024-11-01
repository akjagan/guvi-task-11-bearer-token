require("dotenv").config();
const mongoose = require("mongoose");

async function connectToMongoDB() {
  const url = process.env.MONGODB_URI;
  console.log(`Connecting to MongoDB at: ${url}`);
  try {
    await mongoose.connect(url, {
      tls: true, // Enable TLS
      tlsAllowInvalidCertificates: false, // Strict certificate validation
    });
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
}

module.exports = { connectToMongoDB };


// require("dotenv").config();
// const mongoose = require("mongoose");

// async function connectToMongoDB() {
//   const url = process.env.MONGODB_URI;
//   console.log(`Connecting to MongoDB at: ${url}`);
//   try {
//     await mongoose.connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       tls: true, // Enable TLS
//       tlsAllowInvalidCertificates: false, // Strict certificate validation
//     });
//     console.log("MongoDB connected!");
//   } catch (error) {
//     console.error("Connection error:", error);
//     process.exit(1);
//   }
// }

// module.exports = { connectToMongoDB };
