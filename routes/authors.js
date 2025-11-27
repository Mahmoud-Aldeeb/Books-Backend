const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  Author,
  validateAuthor,
  validateUpdateAuthor,
} = require("../models/Author");

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.get("/", async (req, res) => {
  try {
    const authorList = await Author.find();
    res.status(200).json(authorList);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).send("Author not found");
    else {
      res.status(200).json(author);
    }
  })
);

router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateAuthor(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const newAuthor = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    const result = await newAuthor.save();
    if (!result) {
      return res.status(500).send("The author cannot be created");
    }
    res.status(201).json(result);
  })
);

// update author
router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const author = await Author.findByIdAndUpdate(req.params.id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    });
    res.status(200).json(author);
  })
);

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const author = await Author.findByIdAndDelete(req.params.id);
    res.status(200).json(author);
  })
);

module.exports = router;
