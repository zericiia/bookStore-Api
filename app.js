const express = require("express");
const mongoose = require("mongoose");
const bookPath = require("./Routes/books");
const authorsPath = require("./Routes/authors");
const logger = require("./middlewares/logger");
const dotenv = require("dotenv");
dotenv.config();
// conn to db
mongoose
  .connect(process.env.MONGO_URI)
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

// custom middleware
app.use(logger);

// ROUTES
app.use("/api/books", bookPath);

app.use("/api/authors", authorsPath);

const Port = process.env.PORT;
app.listen(Port, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${Port}`
  )
);
