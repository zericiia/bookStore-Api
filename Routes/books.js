const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  deleteBook,
  updateBook,
  createBook,
  getBookById,
  getAllBooks,
} = require("../controllers/booksController");
// const Redis = require("ioredis");
// const redis = new Redis(); // Connect to local Redis instance

//  /api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);

//  /api/books/:id
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

// router.get("/", getAllBooks);

// router.get("/:id", getBookById);

// router.post("/", verifyTokenAndAdmin, createBook);

// router.put("/:id", verifyTokenAndAdmin, updateBook);

// router.delete("/:id", verifyTokenAndAdmin, deleteBook);

module.exports = router;
