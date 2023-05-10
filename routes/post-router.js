const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const postController = require("../controllers/post-controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
});

router.get("/api/posts", postController.getPosts);

router.post(
  "/api/create_post",
  upload.single("image"),
  postController.createPost
);

router.get("/api/post/:id", postController.getPostById);
router.get("/api/users_posts/:id", postController.geUserPosts);

module.exports = router;
