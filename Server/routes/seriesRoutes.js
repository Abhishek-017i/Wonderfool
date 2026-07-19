const express = require("express");
const router = express.Router();

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
router.post("/", createSeries);
router.put("/:id", updateSeries);
router.delete("/:id", deleteSeries);

module.exports = router;