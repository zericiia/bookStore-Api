const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");
const { Author } = require("../models/Author");

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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // Validate ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid author ID" });
  }

  try {
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

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
    res.status(400).json(error.details[0].message);
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
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
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
    const author = await Author.findByIdAndUpdate(id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },{new:true});

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

router.delete("/:id", (req, res) => {
  const authorId = parseInt(req.params.id);
  const author = authors.find((author) => author.id === authorId);
  if (!author) {
    res.status(404).json({ message: "author not found" });
  }
  res.status(200).json({ message: "author was delted" });
});
// functions
function validateAuthorCreation(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(4).max(200).required(),
    lastName: Joi.string().trim().min(2).max(200).required(),
    nationality: Joi.string().trim().min(2).max(200).required(),
    image: Joi.string().trim().min(3).max(200),
  });
  return ({ error } = schema.validate(obj));
}

function validateAuthorUpdate(obj) {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(4).max(200),
    lastName: Joi.string().trim().min(3).max(200),
    nationality: Joi.string().trim().min(2).max(200),
    image: Joi.string(),
  });
  return ({ error } = schema.validate(obj));
}
module.exports = router;
