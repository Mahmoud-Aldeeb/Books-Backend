const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (err) {
    console.log("Could not connect to MongoDB...", err);
  }

  // mongoose
  //   .connect(process.env.MONGO_URI)
  //   .then(() => console.log("Connected to MongoDB..."))
  //   .catch((err) => console.error("Could not connect to MongoDB...", err));
}

module.exports = connectToDB;
