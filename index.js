require("dotenv").config();
const express = require('express')
const PORT = process.env.PORT || 5000;
const app = express()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors')
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const Post = require('./models/Post.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())
// app.use("/api/navCol", require("./routes/navCol"));

// Set up the MongoDB connection
const CONNECTION_URL = process.env.MONGO_URI;

mongoose
.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log(`Database connected`))
.catch((error) => console.log(`${error} did not connect`));

app.use("/api/auth", require("./routes/user.js"));
app.use("/api/post", require("./routes/post.js"));


// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle incoming Socket.IO events here
//    try {
//     const newPost = new Post(req.body);
//     await newPost.save();
//     console.log('New post saved to the database:', newPost);

//     // Emit a newPost event to connected clients
//     io.emit('newPost', newPost);
//   } catch (error) {
//     console.error('Error saving new post:', error);
//   }

//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });

http.listen(3001, () => {
  console.log("Server running on port 3001");
});

module.exports = { io };

// Start the server
app.listen(PORT, () => console.log(`listening on port ${PORT}!`))

//  process.on("unhandledRejection", (err, promise) => {
//    console.log(`Logged Error: ${err}`);
//    server.close(() => process.exit(1));
//  });
