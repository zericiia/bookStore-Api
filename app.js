const express = require("express");
const path = require("path");
const ConnectToLocalDB = require("./config/db/localDB")
// mdlw
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config();


// Connect to MongoDB
ConnectToLocalDB()

// Initialize app
const app = express();

// Serve static files from the "pages" directory
app.use(express.static(path.resolve(__dirname, "pages")));

// apply middleware
app.use(express.json());
app.use(logger);



// Login route form
app.get("/" , (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages", "login.html"));
});

// Routes
app.use("/api/books", require("./Routes/books"));
app.use("/api/authors", require("./Routes/authors"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/user", require("./Routes/user"));
// vurnauble

// Error handler middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`http://localhost:${Port}`);
});