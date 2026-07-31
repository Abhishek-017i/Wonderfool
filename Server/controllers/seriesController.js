const Series = require("../models/Series");
const Person = require("../models/Person");

const getAllSeries = async (req, res) => {
  try {
    const {
      type,
      status,
      genres,
      country,
      yearStart,
      yearEnd,
      search,
      sortBy,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // Type filter (ANIME, MANGA, NOVEL)
    if (type) {
      const types = type.split(",").map((t) => t.trim());
      filter.type = { $in: types };
    }

    // Status filter (ongoing, finished, hiatus, cancelled)
    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      filter.status = { $in: statuses };
    }

    // Genre filter (match any of the provided genres)
    if (genres) {
      const genreList = genres.split(",").map((g) => g.trim());
      filter.genres = { $in: genreList };
    }

    // Country filter (JP, KR, CN, TW)
    if (country) {
      const countries = country.split(",").map((c) => c.trim());
      filter.countryOfOrigin = { $in: countries };
    }

    // Year range filter
    if (yearStart || yearEnd) {
      filter.startDate = {};
      if (yearStart) {
        filter.startDate.$gte = new Date(`${yearStart}-01-01`);
      }
      if (yearEnd) {
        filter.startDate.$lte = new Date(`${yearEnd}-12-31`);
      }
    }

    // Search filter (title fields)
    if (search) {
      filter.$or = [
        { "title.romaji": { $regex: search, $options: "i" } },
        { "title.english": { $regex: search, $options: "i" } },
        { "title.native": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'averageScore') {
      sortOptions = { averageScore: -1, popularity: -1 };
    } else if (sortBy === 'startDate') {
      sortOptions = { startDate: -1, createdAt: -1 };
    } else if (sortBy === 'popularity') {
      sortOptions = { popularity: -1 };
    }

    const [series, total] = await Promise.all([
      Series.find(filter)
        .populate("staff.personId")
        .populate("adaptations.seriesId")
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Series.countDocuments(filter),
    ]);

    res.status(200).json({
      series,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
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

const searchSeries = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        message: "Please provide a search title",
      });
    }

    const series = await Series.find({
      $or: [
        { "title.romaji": { $regex: title, $options: "i" } },
        { "title.english": { $regex: title, $options: "i" } },
        { "title.native": { $regex: title, $options: "i" } },
      ],
    });

    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  deleteSeries,
  searchSeries,
};