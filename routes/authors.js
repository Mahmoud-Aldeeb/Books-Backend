const express = require("express");
const router = express.Router();

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getAuthorsById,
  createAuthors,
  updateAuthors,
  deleteAuthors,
} = require("../controllers/authorController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createAuthors);

router
  .route("/:id")
  .get(getAuthorsById)
  .put(verifyTokenAndAdmin, updateAuthors)
  .delete(verifyTokenAndAdmin, deleteAuthors);

module.exports = router;
