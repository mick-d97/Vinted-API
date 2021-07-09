const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

const app = express();
app.use(formidable());
app.use(cors());


cloudinary.config({
  cloud_name: "dbzfaosnn",
  api_key: "639558478356169",
  api_secret: "8wZoqKBwI-EFLlu_ibz-DD0BG6o",
  secure: true,
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(400).json({ message: "page not found!" });
});

app.listen(process.env.PORT, () => {
  console.log("server start!");
});
