const mongoose = require("mongoose");
function ConnectToLocalDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Local DB successfully");
  } catch (error) {
    console.log(`Failed to connect to MongoDB: ${error}`);
  }
}

// old way

// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => {
//       console.log("Connected to Local DB successfully");
//     })
//     .catch((error) => {
//       console.log(`Failed to connect to MongoDB: ${error}`);
//     });

module.exports = ConnectToLocalDB;
