const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByArticle,
  getCommentsByReview,
  getReplies,
  likeComment,
} = require("../controllers/commentController");

router.get("/", getAllComments);
router.get("/article/:articleId", getCommentsByArticle);
router.get("/review/:reviewId", getCommentsByReview);
router.get("/replies/:id", getReplies);
router.get("/:id", getCommentById);
router.post("/", verifyToken, createComment);
router.post("/:id/like", verifyToken, likeComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;