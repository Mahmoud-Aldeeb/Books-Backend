const express = require("express");
require("dotenv").config();

const logger = require("./middlewares/logger");
const { errorHandler, notFound } = require("./middlewares/errors");
const connectToDB = require("./config/db");
const path = require("path");
const helmet = require("helmet");

const cors = require("cors");

// init App
const app = express();
app.use(express.json());
app.set("view engine", "ejs");

// static folder
app.use(express.static(path.join(__dirname, "images")));

// Connect to Database
connectToDB();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(logger);

// Helmet
app.use(helmet());

// Cors Policy
app.use(cors());

// Router
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));

app.use("/password", require("./routes/password"));

// Error handling middleware
app.use(notFound);

app.use(errorHandler);

// Running the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
