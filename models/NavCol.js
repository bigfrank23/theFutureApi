const mongoose = require("mongoose");

// Define the User schema
const navColSchema = new mongoose.Schema({
  color: {
    type: Number,
    default: 0
  }
});

// Create a User model
module.exports = mongoose.model("NavCol", navColSchema);
