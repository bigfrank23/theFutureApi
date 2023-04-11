const router = require("express").Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const NavCol = require("../models/NavCol");

router.post("/$inc", async (req, res) => {
  try {
    const result = await NavCol.findByIdAndUpdate(
      { _id: ObjectId("5f5f5f5f5f5f5f5f5f5f5f5f") },
      { $inc: { color: 1 } },
      { new: true, upsert: true }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});
router.post("/$dec", async (req, res) => {
  try {
    const result = await NavCol.findByIdAndUpdate(
      { _id: ObjectId("5f5f5f5f5f5f5f5f5f5f5f5f") },
      { $inc: { color: -1 } },
      { new: true, upsert: true }
    );
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;