const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const bookPath = require("./Routes/books");
const authorsPath = require("./Routes/authors");
// conn to db
mongoose
  .connect("mongodb://localhost/bookStoreDB")
  .then(() => {
    console.log(`connected to db succefully`);
  })
  .catch((error) => {
    console.log(`failed to connect to mongoDB  ${error}`);
  });

// init app
const app = express();
// json middleware
app.use(express.json());

// ROUTES
app.use("/api/books", bookPath);

app.use("/api/authors", authorsPath);

const Port = 5000;
app.listen(Port, () => console.log(`server is running on port ${Port}`));
