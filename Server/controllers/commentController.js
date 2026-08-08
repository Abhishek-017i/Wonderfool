const Comment = require("../models/Comment");

require("../models/User");
require("../models/Article");
require("../models/Review");

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId")
      .populate("likes")
      .populate("parentCommentId")
      .populate("parentId");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("userId")
      .populate("likes")
      .populate("parentCommentId")
      .populate("parentId");

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);

    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({
      parentType: "Article",
      parentId: req.params.articleId,
    })
      .populate("userId")
      .populate("likes")
      .populate("parentCommentId");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCommentsByReview = async (req, res) => {
  try {
    const comments = await Comment.find({
      parentType: "Review",
      parentId: req.params.reviewId,
    })
      .populate("userId")
      .populate("likes")
      .populate("parentCommentId");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getReplies = async (req, res) => {
  try {
    const replies = await Comment.find({
      parentCommentId: req.params.id,
    })
      .populate("userId")
      .populate("likes");

    res.status(200).json(replies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentsByArticle,
  getCommentsByReview,
  getReplies,
};