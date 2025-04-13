const express = require("express");
const router = express.Router();
const {
    getForgetPasswordView,
    sendForgotPasswordLink,
    getResetPasswordView,
    ResetPassword
} = require("../controllers/forgetPassword");

// /password/forget-password                                   password/sendForgotPasswordLink
router
  .route("/forget-password")
  .get(getForgetPasswordView)
  .post(sendForgotPasswordLink);

router.route("/reset-password/:id/:token").get(getResetPasswordView).post(ResetPassword)
module.exports = router;
