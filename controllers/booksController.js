const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
  Book,
  validateBookCreation,
  validateBookUpdate,
} = require("../models/Book");

/**
 * @desc  get all books
 * @route /api/books
 * @method get
 * @access public
 *
 **/
const getAllBooks = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let bookList;
  //
  if (minPrice && maxPrice) {
    bookList = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author", ["firstName", "lastName"]);
  } else {
    bookList = await Book.find().populate("author", ["firstName", "lastName"]);
  }

  res.status(200).json(bookList);
});

/**
 * @desc  get book  by id
 * @route /api/books/:id
 * @method get
 * @access public
 *
 **/
const getBookById = async (req, res) => {
  // Validate ObjectId before querying
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Book ID" });
  }
  //
  try {
    const book = await Book.findById(id).populate("author", ["firstName"]);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

/**
 * @desc  create a book
 * @route /api/books
 * @method post
 * @access public
 *
 **/
const createBook = async (req, res) => {
  // schema validation
  const { error } = validateBookCreation(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }
  //
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

/**
 * @desc  update  a book
 * @route /api/books/:id
 * @method put
 * @access public
 *
 **/

const updateBook = async (req, res) => {
  // Validate ObjectId before querying
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  // book validation
  const { error } = validateBookUpdate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message),
    });
  }
  //start query
  try {
    const book = await Book.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    if (!book) return res.status(404).json({ message: "book was not found." });
    res.json(book).status(200);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

/**
 * @desc  Delete a book
 * @route /api/books/:id
 * @method delete
 * @access public
 *
 **/
const deleteBook = async (req, res) => {
  // Validate id
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  // start query delete
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "book was not found." });
    }
    return res.status(200).json({ message: `book deleted: ${book}` });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};
module.exports = { getAllBooks,deleteBook,updateBook,createBook,getBookById };
