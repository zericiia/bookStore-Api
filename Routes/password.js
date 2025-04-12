const express = require("express");
const router = express.Router();
const { getForgetPawssordView } = require("../controllers/forgetPassword");


// /password/forget-password
router.route("/forget-password").get(getForgetPawssordView);
module.exports = router;
