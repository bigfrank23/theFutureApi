const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { io } = require("../index");

// Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    
    await newPost.save();

    res.status(201).json({newPost, message: 'Successfully Created!'});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//Get all post
router.get('/', async(req,res)=> {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const totalCount = await Post.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const items = await Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    res.json({ items, totalPages });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

// // Get Single Post
router.get("/:id", async (req, res) => {

  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
