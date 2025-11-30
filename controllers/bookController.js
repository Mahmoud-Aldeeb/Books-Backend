const asyncHandler = require("express-async-handler");
const { Book, validateBook, validateUpdateBook } = require("../models/Books");

const getAllBooks = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let books;
  if (minPrice && maxPrice) {
    books = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author", ["firstName", "lastName", "id"]);
  } else {
    books = await Book.find().populate("author", [
      "firstName",
      "lastName",
      "id",
    ]);
  }
  console.log("books", books);
  res.status(200).json(books);
});

const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author", [
    "firstName",
    "lastName",
    "id",
  ]);

  if (!book) return res.status(404).send("Book not found");
  else if (book) {
    res.status(200).json(book);
  }
});

const createBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
  });
  const result = await newBook.save();
  res.status(201).json(result);
});

const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdateBook(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
      },
    },
    { new: true }
  );
  res.status(200).json(book);
});

const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).send("Book not found");
  else {
    res.status(200).json(book);
  }
});

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
