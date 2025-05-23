const asyncHandler = require("express-async-handler");
const { User,validateResetPassword } = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // Add JWT for token generation
const { link, func } = require("joi");
/**
 *  @desc    Get forgot password page
 *  @route   /password/forget-password
 *  @method  get
 *  @access  public
 */
module.exports.getForgetPasswordView = asyncHandler(async (req, res) => {
  res.render("forgetPassword");
});

/**
 *  @desc    send Forgot Password Link To Email
 *  @route   /password/forget-password
 *  @method  post
 *  @access  public
 */
module.exports.sendForgotPasswordLink = async (req, res) => {
  // check user if exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user was not found" });
  }

  try {
    // gen token with pass
    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user.id, email: user.email }, secret,{ expiresIn: '15m' });
  } catch (error) {
    console.error("jwt  error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
  // TO DO SEND TO EMAIL
  const link = `http://localhost:${process.env.PORT}/password/reset-password/${user.id}/${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Sender_Email,
      pass: process.env.Email_App_pass,
    },
  });

  const mailOptions = {
    from: process.env.Sender_Email,
    to: user.email,
    subject: "Reset Password",
    html: `<div>
             <h4>Click On The Link To Reset Your Password</h4>
             <p><a href="${link}">${link}</a></p>
           </div>`,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    } else {
      console.log("Email Sent", success.response);
      res.render("link-password");
    }
  });
};

/**
 *  @desc    get reset password view
 *  @route   /password/reset-password/:id/:token
 *  @method  get
 *  @access  public
 */
module.exports.getResetPasswordView = async (req, res) => {
  const token = req.params.token;

  // check user if exist
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "user was not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(token, secret);
    // return res.render("reset-password");
    res.render("password-reset", { email: user.email });
  } catch (error) {
    console.log(error);
    res.status(200).json("Error");
  }
};

/**
 *  @desc    reset password
 *  @route   /password/reset-password/:id/:token
 *  @method  post
 *  @access  public
 */
module.exports.ResetPassword = async (req, res) => {
  // validate new password
  const { error } = validateResetPassword(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  // validation
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user was not found" });
  }
  const secret = process.env.JWT_SECRET + user.password;
  try {
    jwt.verify(req.params.token, secret);
    // reset password
    salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.render("success-password");
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};
