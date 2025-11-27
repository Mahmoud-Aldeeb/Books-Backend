const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
/**
 * @desc Update user
 * @route /api/users/:id
 * @method PUT
 * @access Private
 */

router.put(
  "/:id",
  verifyTokenAndAuthorization,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    if (req.body.password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
  })
);

/**
 * @desc Get All users
 * @route /api/users
 * @method GEt
 * @access Private (Admin only)
 */
router.get(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  })
);

/**
 * @desc Get users By ID
 * @route /api/users/:id
 * @method GEt
 * @access Private (Admin only & user himself)
 */
router.get(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  })
);

/**
 * @desc Delete user
 * @route /api/users/:id
 * @method DELETE
 * @access Private (Admin only & user himself)
 */
router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted." });
  })
);

module.exports = router;
