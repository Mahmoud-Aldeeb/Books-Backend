const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true }
);
const Book = mongoose.model("Book", BookSchema);

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim(),
    author: Joi.string().required().trim(),
    description: Joi.string().min(10).max(500).required().trim(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid("soft cover", "hard cover").required(),
  });
  return schema.validate(book);
}
function validateUpdateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).trim(),
    author: Joi.string().trim(),
    description: Joi.string().min(10).max(500).trim(),
    price: Joi.number().min(0),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });
  return schema.validate(book);
}
module.exports = { Book, validateBook, validateUpdateBook };
