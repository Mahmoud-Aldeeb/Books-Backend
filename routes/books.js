const express = require("express");

const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Book, validateBook, validateUpdateBook } = require("../models/Books");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// Http Methods / Verbs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const Books = await Book.find().populate("author", [
      "firstName",
      "lastName",
      "id",
    ]);
    res.status(200).json(Books);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author", [
      "firstName",
      "lastName",
      "id",
    ]);

    if (!book) return res.status(404).send("Book not found");
    else if (book) {
      res.status(200).json(book);
    }
  })
);

router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
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
  })
);

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
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
  })
);

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send("Book not found");
    else {
      res.status(200).json(book);
    }
  })
);

module.exports = router;
