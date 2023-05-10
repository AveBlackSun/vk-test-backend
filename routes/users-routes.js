const express = require("express");

const {
  getUsers,
  getUser,
  deleteUser,
  addUser,
  updateUser,
} = require("../controllers/user-controller");

const router = express.Router();

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.delete("/user/:id", deleteUser);
router.post("/users", addUser);
router.patch("/user/:id", updateUser);

module.exports = router;
