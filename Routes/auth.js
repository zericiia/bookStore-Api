const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { login, Register } = require("../controllers/authController");
// Configure rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
});

//  /api/auth/register
router.post("/register",Register);

// /api/auth/login
router.post("/login", loginLimiter,login);

module.exports = router;
