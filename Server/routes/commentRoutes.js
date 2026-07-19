const express = require("express");
const router = express.Router();

const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByArticle,
  getCommentsByReview,
  getReplies,
} = require("../controllers/commentController");

router.get("/", getAllComments);
router.get("/article/:articleId", getCommentsByArticle);
router.get("/review/:reviewId", getCommentsByReview);
router.get("/replies/:id", getReplies);
router.get("/:id", getCommentById);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = router;