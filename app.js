const express = require("express");
require("dotenv").config();

const logger = require("./middlewares/logger");
const { errorHandler, notFound } = require("./middlewares/errors");
const connectToDB = require("./config/db");
// init App
const app = express();
app.use(express.json());

// Connect to Database
connectToDB();

// middleware
app.use(logger);

// Router
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

// Error handling middleware
app.use(notFound);

app.use(errorHandler);

// Running the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
