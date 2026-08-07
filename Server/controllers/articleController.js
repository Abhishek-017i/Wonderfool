const Article = require("../models/Article");

require("../models/User");
require("../models/Person");
require("../models/Series");

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("authorId")
      .populate("taggedCreators")
      .populate("taggedSeries")
      .populate("likes");

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
    const article = new Article(req.body);

    const savedArticle = await article.save();

    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "Article deleted successfully",
    });
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

const getArticlesByUser = async (req, res) => {
  try {
    const articles = await Article.find({ authorId: req.params.userId })
      .populate('authorId', 'name avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllArticles,
  getArticlesByUser,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCreator,
};