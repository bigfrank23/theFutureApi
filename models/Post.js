const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
    },
    userImg: {
      type: String,
      required: false,
    },
    comments: [
      {
        text: String,
        date: { type: Date, default: Date.now },
        user: String,
        profilePic: String,
        commentImage: String,
        likes: [
          {
            userId: {
              type: String,
              required: true,
            },
            name: {
              type: String,
              required: true,
            },
            image: {
              type: String,
            },
          },
        ],
      },
    ],
    likes: [
      {
        userId: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
