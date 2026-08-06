const Article = require("../models/Article");

require("../models/User");
require("../models/Person");
require("../models/Series");

const getAllArticles = async (req, res) => {
  try {
    const { sortBy = "mostRecent", status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    let articles = await Article.find(filter)
      .populate("authorId")
      .populate("taggedCreators")
      .populate("taggedSeries")
      .populate("likes");

    if (sortBy === "mostLiked") {
      articles.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("authorId")
      .populate("taggedCreators")
      .populate("taggedSeries")
      .populate("likes");

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const article = new Article({ ...req.body, authorId: req.mongoUser._id });
    const savedArticle = await article.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.authorId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this article" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.authorId.toString() !== req.mongoUser._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this article" });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArticlesByCreator = async (req, res) => {
  try {
    const articles = await Article.find({
      taggedCreators: req.params.personId,
      status: "published",
    })
      .populate("authorId")
      .populate("taggedCreators")
      .populate("taggedSeries")
      .populate("likes");

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCreator,
};