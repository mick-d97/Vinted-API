const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import des models

const User = require("../models/User");
//connexion d'un utilisateur
router.post("/user/login", async (req, res) => {
  try {
    const isEmailExist = await User.findOne({ email: req.fields.email });
    if (isEmailExist) {
      const newHash = SHA256(req.fields.password + user.salt).toString(
        encBase64
      );
      //On vérifie que le hash dans la bdd et le nouveau hash sont égaux pour valider la connexion
      if (newHash === user.hash) {
        res
          .status(200)
          .json({
            email: user.email,
            account: user.account,
            token: user.token,
          });
      } else {
        res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "Email Unauthorized valide" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//Enregistrement d'un nouvel utilisateur
router.post("/user/signup", async (req, res) => {
  try {
    const salt = uid2(16);
    const hash = SHA256(req.fields.password + salt).toString(encBase64);
    const token = uid2(16);
    const isEmailExist = await User.findOne({ email: req.fields.email });

    if (isEmailExist) {
      if (req.fields.username) {
        const newUser = new User({
          email: req.fields.email,
          account: {
            username: req.fields.username,
            phone: req.fields.phone,
          },
          hash: hash,
          salt: salt,
          token: token,
        });
        console.log(isEmailExist);
        await newUser.save();
        res.status(200).json({ message: "user created successfully" });
      } else {
        res.status(400).json({ message: "username is not informed" });
      }
    } else {
      res.status(400).json({ message: "email already exist" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
