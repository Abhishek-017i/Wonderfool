const Series = require("../models/Series");
const Person = require("../models/Person");

const getAllSeries = async (req, res) => {
  try {
    const series = await Series.find()
      .populate("staff.personId")
      .populate("adaptations.seriesId");

    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSeriesById = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id)
      .populate("staff.personId")
      .populate("adaptations.seriesId");

    if (!series) {
      return res.status(404).json({
        message: "Series not found",
      });
    }

    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSeries = async (req, res) => {
  try {
    const newSeries = new Series(req.body);

    const savedSeries = await newSeries.save();

    res.status(201).json(savedSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSeries = async (req, res) => {
  try {
    const updatedSeries = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSeries) {
      return res.status(404).json({
        message: "Series not found",
      });
    }

    res.status(200).json(updatedSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSeries = async (req, res) => {
  try {
    const deletedSeries = await Series.findByIdAndDelete(req.params.id);

    if (!deletedSeries) {
      return res.status(404).json({
        message: "Series not found",
      });
    }

    res.status(200).json({
      message: "Series deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
};