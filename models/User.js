const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  interests: [
    {
      type: String,
      required: true,
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    // required: true,
  },
  profilePhotoURL: {
    type: String,
  },
  profilePhoto: {
    type: String,
  },
  cloudinary_id: String,
  bio: String,
  jobTitle: String,
  dob: String,
  maritalStatus: String
}, {timestamps: true});

// Create a User model
module.exports = mongoose.model("User", userSchema);
