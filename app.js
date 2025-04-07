const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bookPath = require("./Routes/books");
const authorsPath = require("./Routes/authors");
const authPath = require("./Routes/auth");
const userPath = require("./Routes/user");


// testing for cybersecurity
const authPathV = require("./Routes/authV");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv");



dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Local DB successfully");
  })
  .catch((error) => {
    console.log(`Failed to connect to MongoDB: ${error}`);
  });

// Initialize app
const app = express();

// Serve static files from the "pages" directory
app.use(express.static(path.resolve(__dirname, "pages")));

// JSON middleware
app.use(express.json());

// Custom middleware
app.use(logger);


// Login route form
app.get("/" , (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages", "login.html"));
});

// Routes
app.use("/api/books", bookPath);
app.use("/api/authors", authorsPath);
app.use("/api/auth", authPath);
app.use("/api/user", userPath);
// vurnauble
app.use("/api/authV", authPathV);

// Error handler middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`http://localhost:${Port}`);
});