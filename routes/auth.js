const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
/**
 * @desc Register a new user
 * @route /api/auth/register
 * @method POST
 * @access Public
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      // isAdmin: req.body.isAdmin,
    });
    const result = await user.save();

    // hidden password in response
    const token = user.generateToken();
    const { password, ...other } = result.toObject();
    res.status(201).json({ ...other, token });
  })
);

/**
 * @desc Login user
 * @route /api/auth/login
 * @method POST
 * @access Public
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    // hidden password in response
    const token = user.generateToken();
    const { password, ...other } = user.toObject();
    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
