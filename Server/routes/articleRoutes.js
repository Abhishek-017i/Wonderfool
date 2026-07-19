const express = require("express");
const router = express.Router();

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
router.post("/", createArticle);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

module.exports = router;