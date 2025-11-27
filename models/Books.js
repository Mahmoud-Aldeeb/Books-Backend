const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema({
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
});

function validateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required().trim(),
    author: Joi.string().required().trim(),
    description: Joi.string().min(10).max(500).required().trim(),
  });
  return schema.validate(book);
}
function validateUpdateBook(book) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).trim(),
    author: Joi.string().trim(),
    description: Joi.string().min(10).max(500).trim(),
  });
  return schema.validate(book);
}
const Book = mongoose.model("Book", authorSchema);
module.exports = { Book, validateBook, validateUpdateBook };
