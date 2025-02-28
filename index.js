const express = require("express");
const mongoose = require("mongoose");
const { resolve } = require("path");
const BlogPost = require("./schema"); 
const cors = require("cors"); 

const app = express();
const port = 3010;


app.use(express.json()); 
app.use(cors()); 

mongoose
  .connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use(express.static("static"));


app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "pages/index.html"));
});


app.post("/create-post", async (req, res) => {
  try {
    console.log("Received request:", req.body); // Debugging
    const newPost = new BlogPost(req.body);
    await newPost.save();
    res.status(201).json({ message: "Blog post created!", post: newPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/posts", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});