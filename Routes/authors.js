const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
  Author,
  validateAuthorUpdate,
  validateAuthorCreation,
} = require("../models/Author");

/**
 * @desc  get all authors
 * @route /api/books
 * @method get
 * @access public
 *
 **/

router.get("/", async (req, res) => {
  try {
    const authorsList = await Author.find();
    // .select().sort()

    res.status(200).json(authorsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @desc  get author by id
 * @route /api/books
 * @method get
 * @access public
 *
 **/
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // Validate ObjectId before querying
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid author ID" });
    }
    //
    const author = await Author.findById(id);
    if (!author) return res.status(404).json({ message: "Author not found" });
    res.status(200).json(author);
  })
);

/**
 * @desc  create an author
 * @route /api/books
 * @method post
 * @access public
 *
 **/
router.post("/", async (req, res) => {
  const { error } = validateAuthorCreation(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  } else {
    try {
      const author = new Author({
        // author is an object of the Author classs
        // id: authors.length + 1,  the data base add the id automaticaly
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      });

      const result = await author.save();

      res.status(201).json(result);
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "An internal server error occurred" });
    }
  }
});

/**
 * @desc  update an author
 * @route /api/books
 * @method put
 * @access public
 *
 **/

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  // validate update body
  const { error } = validateAuthorUpdate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
  }
  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid author ID" });
  }
  try {
    const author = await Author.findByIdAndUpdate(
      id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @desc  delete an author
 * @route /api/books
 * @method delete
 * @access public
 *
 **/

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid author ID" });
  }

  try {
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      return res.status(404).json({ message: "Author was not found." });
    }

    return res
      .status(200)
      .json({ message: `Author deleted: ${deletedAuthor}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
