require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users-routes");
const uploadRouter = require("./routes/upload-router");
const loginRouter = require("./routes/login-router");
const postRouter = require("./routes/post-router");
const path = require("path");

const PORT = 4000;
const URL = process.env.MONGODB_URL;

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("Connected to MongoDB"))
  .catch((err) => console.log(`DB connection error: ${err}`));

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`listening port ${PORT}`);
});

const User = require("./models/user");

User.collection.createIndex({ email: 1 }, { unique: true });

app
  .use(loginRouter)
  .use(userRoutes)
  .use(uploadRouter)
  .use(postRouter)
  .use("/uploads", express.static(path.join(__dirname, "uploads")));
