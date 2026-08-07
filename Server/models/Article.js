const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taggedCreators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Person' }],
  taggedSeries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Series' }],
  coverImage: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['published', 'pending'], default: 'published' },
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);