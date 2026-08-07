const Series = require("../models/Series");
const Person = require("../models/Person");

const getAllSeries = async (req, res) => {
  try {
    const {
      type,
      status,
      genres,
      demographic,
      country,
      yearStart,
      yearEnd,
      search,
      sortBy,
      minRating,
      episodeMin,
      episodeMax,
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

    // Genre and Demographic filter
    let combinedGenres = [];
    if (genres) {
      combinedGenres.push(...genres.split(",").map((g) => g.trim()));
    }
    if (demographic) {
      combinedGenres.push(...demographic.split(",").map((d) => d.trim()));
    }
    if (combinedGenres.length > 0) {
      filter.genres = { $in: combinedGenres };
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

    // Min Rating filter
    if (minRating) {
      filter.averageScore = { $gte: Number(minRating) * 10 };
    }

    // Episode / Chapter Count filter
    const andConditions = [];
    
    if (episodeMin || episodeMax) {
      const countFilter = {};
      if (episodeMin) countFilter.$gte = Number(episodeMin);
      if (episodeMax) countFilter.$lte = Number(episodeMax);
      andConditions.push({
        $or: [
          { episodeCount: countFilter },
          { chapterCount: countFilter }
        ]
      });
    }

    // Search filter (title fields)
    if (search) {
      andConditions.push({
        $or: [
          { "title.romaji": { $regex: search, $options: "i" } },
          { "title.english": { $regex: search, $options: "i" } },
          { "title.native": { $regex: search, $options: "i" } }
        ]
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'averageScore') {
      sortOptions = { averageScore: -1, popularity: -1 };
    } else if (sortBy === 'newest' || sortBy === 'startDate') {
      sortOptions = { startDate: -1, createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { startDate: 1, createdAt: 1 };
    } else if (sortBy === 'popularity' || sortBy === 'trending') {
      sortOptions = { popularity: -1 };
    } else if (sortBy === 'title') {
      sortOptions = { 'title.romaji': 1 };
    } else if (sortBy === 'updated') {
      sortOptions = { updatedAt: -1 };
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
    const { id } = req.params;
    const mongoose = require("mongoose");
    let series = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      series = await Series.findById(id)
        .populate("staff.personId")
        .populate("adaptations.seriesId");
    }

    if (!series) {
      const cleanQuery = id.replace(/[-_]/g, " ");
      series = await Series.findOne({
        $or: [
          { "title.romaji": { $regex: cleanQuery, $options: "i" } },
          { "title.english": { $regex: cleanQuery, $options: "i" } },
          { "title.native": { $regex: cleanQuery, $options: "i" } },
        ],
      })
        .populate("staff.personId")
        .populate("adaptations.seriesId");
    }

    if (!series) {
      series = await Series.findOne()
        .populate("staff.personId")
        .populate("adaptations.seriesId");
    }

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