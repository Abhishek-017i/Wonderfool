const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
  searchSeries,
} = require("../controllers/seriesController");

router.get("/", getAllSeries);
router.get("/search", searchSeries);
router.get("/:id", getSeriesById);
router.post("/", verifyToken, createSeries);
router.put("/:id", verifyToken, updateSeries);
router.delete("/:id", verifyToken, deleteSeries);

module.exports = router;