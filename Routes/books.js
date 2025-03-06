const express = require("express");
const Joi = require("joi");
const router = express.Router();

const books = [
  {
    id: 1,
    title: "black swan",
    price: 20,
    author: "karim brahimi",
  },
  {
    id: 2,
    title: "niggas in paris",
    price: 100,
    author: "kanye west",
  },
];
/**
 * @desc  get all books
 * @route /api/books
 * @method get
 * @access public
 *
 **/

router.get("/", (req, res) => {
  res.status(200).json(books);
});
/**
 * @desc  get book  by id
 * @route /api/books/:id
 * @method get
 * @access public
 *
 **/
router.get("/:id", (req, res) => {
  const bookId = req.params.id;
  const book = books.find((book) => book.id === parseInt(bookId));
  if (!book) {
    res.status(404).json({ message: "book not found" });
  } else {
    res.status(200).json(book);
  }
});

/**
 * @desc  create a book
 * @route /api/books
 * @method post
 * @access public
 *
 **/
router.post("/", (req, res) => {
  // schema
  const { error } = validateCreateBook(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  const book = {
    id: books.length + 1,
    title: req.body.title,
    price: req.body.price,
    author: req.body.author,
  };

  books.push(book);
  res.status(201).json(book); // 201 => created sucessfully
});

/**
 * @desc  update  a book
 * @route /api/books/:id
 * @method put
 * @access public
 *
 **/
router.put("/:id", (req, res) => {
  const { error } = validateEditBook(req.body);

  if (error) {
    return res.status(400).json(error.details[0].message);
  }
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res.status(404).json({ message: "book not found" });
  } else {
    res.status(200).json({ message: "book has been updated" });
  }
});

/**
 * @desc  Delete a book
 * @route /api/books/:id
 * @method delete
 * @access public
 *
 **/
router.delete("/:id", (req, res) => {
  // chek if book exist
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res.status(404).json({ message: "book not found" });
  } else {
    res.status(200).json({ message: "book has been Deleted" });
  }
});

function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    price: Joi.number().min(0).required(),
    author: Joi.string().trim().min(3).max(200).required(),
  });
  return ({ error } = schema.validate(obj));
}

function validateEditBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    price: Joi.number().min(0),
    author: Joi.string().trim().min(3).max(200),
  });
  return ({ error } = schema.validate(obj));
}
// export
module.exports = router;
