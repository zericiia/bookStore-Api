const asyncHandler = require("express-async-handler");

module.exports.getForgetPawssordView = asyncHandler(async (req, res) => {
  res.render("forgetPassword");
});
