const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { books, authors } = require("./data");
const ConnectToLocalDB = require("./config/db/localDB");
require("dotenv").config();

// connect to DB
ConnectToLocalDB();

// Insert books
const ImportBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books Impoerted");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Remove books
const RemoveBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books Removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
// Insert Authors
const ImportAuthor = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors Impoerted");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
if (process.argv[2] === "-import") {
  ImportBooks();
} else if (process.argv[2] === "-remove") {
  RemoveBooks();
}else if (process.argv[2] === "-import-authors") {
  ImportAuthor();
}
