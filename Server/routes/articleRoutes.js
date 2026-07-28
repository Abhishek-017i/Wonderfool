const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCreator,
} = require("../controllers/articleController");

router.get("/", getAllArticles);
router.get("/creator/:personId", getArticlesByCreator);
router.get("/:id", getArticleById);
router.post("/",verifyToken, createArticle);
router.put("/:id",verifyToken, updateArticle);
router.delete("/:id",verifyToken, deleteArticle);

module.exports = router;