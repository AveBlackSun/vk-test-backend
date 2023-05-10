const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  born: {
    type: Date,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  university: {
    type: String,
    default: "",
  },
  image: {
    type: String,
  },
  // friends: [String],
  token: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  const payload = {
    user: {
      id: this.id,
    },
  };

  this.token = jwt.sign(payload, "mySecretKey", { expiresIn: "1h" });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
