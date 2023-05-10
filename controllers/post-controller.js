const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: 1 });
    const postDataArray = [];

    for (const post of posts) {
      const user = await User.findById(post.creator);

      const postData = {
        postid: post._id,
        text: post.text,
        image: post.image,
        creatorid: user._id,
        creatorname: user.name,
        creatorimage: user.image,
      };
      postDataArray.push(postData);
    }

    res.json(postDataArray);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  const { text } = req.body;
  let { file } = req.body;
  const { creator } = req.body;
  if (!req.file || !req.file.file) {
    file = "";
  }

  try {
    const post = await Post.create({
      text,
      image: file,
      creator,
    });

    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  console.log(req);
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(post.creator);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const postData = {
      postid: post._id,
      text: post.text,
      image: post.image,
      creatorid: user._id,
      creatorname: user.name,
      creatorimage: user.image,
    };
    res.json(postData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.geUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.params.id });
    const user = await User.findById(req.params.id, { name: 1, image: 1 });
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postDataArray = [];
    posts.forEach((post) => {
      const postData = {
        postid: post._id,
        text: post.text,
        image: post.image,
        creatorid: user._id,
        creatorname: user.name,
        creatorimage: user.image,
      };
      postDataArray.push(postData);
    });

    res.json(postDataArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
