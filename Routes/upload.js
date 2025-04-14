const express = require("express");
const router = express.Router();
const Path = require("path");
const multer = require("multer");
const { func } = require("joi");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({
  storage,
  //   Middleware for Image Type Validation
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(file.mimetype);
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// /api/upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ message: "Image uploaded" });
});
module.exports = router;
