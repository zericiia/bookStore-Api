const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const {
  User,
  validateLoginUser,
  validateRegisterUser,
} = require("../models/user");

/**
 * @desc  Register New User
 * @route /api/auth/register
 * @method post
 * @access public
 *
 **/
router.post("/register", async (req, res) => {
  // validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }
  // querying db
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "This user already exists" });
    }
    //   hashing
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      isAdmin: req.body.isAdmin || false,
    });
    const result = await user.save();
    //
    const token = null;
    const { password, ...userData } = result._doc;
    userData.token = token; // Add token to the response

    // Send response
    res.status(201).json(userData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

/**
 * @desc  login
 * @route /api/auth/login
 * @method post
 * @access public
 *
 **/
router.post("/login", async (req, res) => {
  // validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }
  // querying db
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "invalid email" });
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // 
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "invalid password" });
    }

    const token = null;
    const { password, ...userData } = user._doc;
    userData.token = token; // Add token to the response
    // Send response
    res.status(200).json(userData);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});
module.exports = router;
