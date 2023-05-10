const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");
const router = express.Router();
// const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/api/user-photo/:id", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("no file");
      return res.status(400).send("No files were uploaded.");
    }

    const userId = req.params.id;
    const newPhotoName = req.file.filename;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.image = newPhotoName;
    await user.save();

    res.json({ imgPath: `/uploads/${newPhotoName}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
});

router.post("/api/upload/", async (req, res) => {
  const { default: nanoid } = await import("nanoid");
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no file");
      return res.status(400).send("No files were uploaded.");
    }

    const img = req.files.img;
    const imgExt = img.name.split(".").pop();
    const imgName = `${nanoid()}.${imgExt}`;
    const imgPath = join("/uploads/", imgName);

    await img.mv(imgPath);
    res.json({ imgPath: `/uploads/${imgName}` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
});

router.post("/api/save", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("no file");
    }
    const text = req.body.text;

    const creator = req.body.creator;
    let newPhotoName = req.file.filename || "";

    console.log(text, creator, newPhotoName);
    const post = await Post.create({
      text,
      image: newPhotoName,
      creator,
    });

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
