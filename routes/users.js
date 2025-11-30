const express = require("express");
const router = express.Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/usersController");

router.get("/", verifyTokenAndAdmin, getAllUsers);

router
  .route("/:id")
  .put(verifyTokenAndAuthorization, updateUser)
  .get(verifyTokenAndAdmin, getUserById)
  .delete(verifyTokenAndAdmin, deleteUser);

module.exports = router;
