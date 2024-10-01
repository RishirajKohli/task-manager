const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then((err) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    throw err;
  });
