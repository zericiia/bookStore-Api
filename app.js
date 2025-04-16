const express = require("express");
const path = require("path");
const { ConnectToLocalDB, ConnectToOnlineDB } = require("./config/db/localDB");
const cors = require("cors")
// mdlw
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { log } = require("console");
require("dotenv").config();

// Connect to MongoDB
ConnectToLocalDB();
// ConnectToOnlineDB()
// Initialize app
const app = express();

app.use(cors({
  origin:*;
}));
// Serve static files from the "pages" directory
app.use(express.static(path.resolve(__dirname, "pages")));
const testpath = path.join(__dirname, "pages");
console.log(__dirname);

console.log(testpath);

// apply middleware
app.use(express.json());
app.use(logger);
app.set("view engine", "ejs");
//  allow to send data from the field
app.use(express.urlencoded({ extended: false }));
// Login route form
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages", "login.html"));
});

// Routes
app.use("/api/books", require("./Routes/books"));
app.use("/api/authors", require("./Routes/authors"));
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/user", require("./Routes/user"));
app.use("/password", require("./Routes/password"));
app.use("/api/upload", require("./Routes/upload"));
// Error handler middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV || "development"} mode`
  );
  console.log(`http://localhost:${Port}`);
});
