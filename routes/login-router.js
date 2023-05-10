const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "mySecretKey";
const express = require("express");

const router = express.Router();

// Login endpoint
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err);
      } else {
        console.log("Decoded token:", decoded);
      }
    });
    user.token = token;

    res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
