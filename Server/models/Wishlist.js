const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  status: { type: String, enum: ['planning', 'in-progress', 'finished'], default: 'planning' },
  startedDate: Date,
  finishedDate: Date,
}, { timestamps: true });

wishlistSchema.index({ userId: 1, seriesId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);