const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/User')
const twilio = require('twilio')
const { check, validationResult } = require("express-validator");
const multer = require("multer"); //required to convert images from client-side to binary for storage (console.log the image from both client and server side to understand fully)
const upload = multer({ dest: "uploads/" }); //multer will automatically create a folder named uploads where req.file.path will be stored
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");

// Set up the Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "freeman20",
  api_key: "125851632345847",
  api_secret: "ZjgfeulGSf9rgU-t4gJFEubx6dk",
});
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const signupValidator = [
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
    check("userName").not().isEmpty().withMessage("Username is required"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("email").isEmail().withMessage("Invalid email"),
    check("phone").not().isEmpty().withMessage("Phone number is required"),
    check("interest").not().isEmpty().withMessage("Interest is required"),
  ]

// Define the routes
router.post( "/register", signupValidator, upload.single("profilePhoto"), async (req, res) => { //profilePhoto string in multer's upload.single() has to bear same name of the req.file from client
    try {
      // Validate the user input
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if the user already exists
      const { userName, email, phone, firstName, lastName, interests} = req.body;

      let profilePhotoUrl, cloudinary_id;
    if (req.file) { //run this if req.file exists
      const folderName = "gadahere"; // set your desired cloudinary folder name here

        // Upload the file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: folderName,
          public_id: `profile-photos/${uuidv4()}`, // set your desired public ID here
          tags: "profile_photo", //this will create a folder named profile_photo inside main gadahere folder
          overwrite: true,
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        });
        profilePhotoUrl = uploadResponse.secure_url;
        cloudinary_id = uploadResponse.public_id;
      }

      let existingUser = await User.findOne({
        $or: [{ userName }, { email }, { phone }],
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Save the user to the database
      result = await User.create({
        firstName,
        lastName,
        userName,
        password: hashedPassword,
        email,
        interests,
        phone,
        profilePhoto: profilePhotoUrl || null, //if req.file exist, save file else null
        cloudinary_id: cloudinary_id || "", //if req.file exist, save file else null
        // profilePhotoURL: req.file.path, // store the path of the uploaded file (for multer)
      });

      //   // Generate an OTP
      // const otp = Math.floor(100000 + Math.random() * 900000);

      // // Send the OTP to the user's phone number or email
      // const message = `Your OTP is ${otp}`;
      // await client.messages.create({
      //   body: message,
      //   to: email, // or phone
      //   from: process.env.TWILIO_PHONE_NUMBER, // your Twilio phone number
      // });

      // Return the JWT token and user information
      const token = jwt.sign(
        { id: result._id, email: result.email },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );

      const { password, ...others } = result._doc;
      res.status(200).json({ token, result: others, message: 'Registration Successful!'  });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/login", async (req, res) => {
  // const {email, password} = req.body

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser)
      return res.status(404).json({ message: "User does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...others } = existingUser._doc;

    res.status(200).json({ result: others, token, message: 'Login Successful!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. That's all we know" });
    console.error(error);
  }
}); 

//Add/update user info to database
router.put("/:id", async (req, res) => {
  // console.log(req.params.id)
  // console.log(req.body)
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ updatedUser, message: "Congratulation!" });
  } catch (err) {
    res.status(500).json(err);
  }
});


//Get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    // console.log(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
