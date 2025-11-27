const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: String,
      required: true,
      default: "default.jpg",
    },
  },
  { timestamps: true }
);

const Author = mongoose.model("Author", authorSchema);

function validateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().trim(),
    lastName: Joi.string().min(3).max(50).required().trim(),
    nationality: Joi.string().min(3).max(50).required().trim(),
    image: Joi.string(),
  });
  return schema.validate(author);
}
function validateUpdateAuthor(author) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).trim(),
    lastName: Joi.string().min(3).max(50).trim(),
    nationality: Joi.string().min(3).max(50).trim(),
    image: Joi.string().trim(),
  });
  return schema.validate(author);
}

module.exports = { Author, validateAuthor, validateUpdateAuthor };
