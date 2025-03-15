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
  } else {
    // querying db
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "This User Already Exist" });
      }
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(body.req.password, salt);
      user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
      });
      const result = await user.save();
      //
      const token = null;
      const {password,...other}= result._docl;

      res.status(201).json(other,token);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "An internal server error occurred" });
    }
  }
});

module.exports = router;
