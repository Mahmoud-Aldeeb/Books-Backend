const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate Token Method
schema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET
  );
};

// User Model
const User = mongoose.model("User", schema);

const validateRegisterUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required().trim(),
    email: Joi.string().email().min(5).max(100).required().trim(),
    password: Joi.string().min(6).required().trim(),
    // isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
};
const validateLoginUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(100).required().trim(),
    password: Joi.string().min(6).required().trim(),
  });
  return schema.validate(user);
};

const validateUpdateUser = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).trim(),
    email: Joi.string().email().min(5).max(100).trim(),
    password: Joi.string().min(6).trim(),
    // isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
