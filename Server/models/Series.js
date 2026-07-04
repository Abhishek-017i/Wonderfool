const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: {
    romaji: String,
    english: String,
    native: String,
  },
  type: { type: String, enum: ['ANIME', 'MANGA', 'NOVEL'], required: true },
  countryOfOrigin: { type: String, enum: ['JP', 'KR', 'CN', 'TW'] },
  synopsis: String,
  genres: [String],
  status: { type: String, enum: ['ongoing', 'finished', 'hiatus', 'cancelled'] },
  startDate: Date,
  endDate: Date,
  episodeCount: Number,
  chapterCount: Number,
  volumeCount: Number,
  coverImage: String,
  bannerImage: String,
  characters: [{
    name: String,
    photo: String,
    role: { type: String, enum: ['MAIN', 'SUPPORTING'] },
  }],
  staff: [{
    personId: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
    designation: String,
  }],
  adaptations: [{
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    relationType: String,
  }],
  aniListId: { type: Number, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Series', seriesSchema);