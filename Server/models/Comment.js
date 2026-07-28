const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const commentSchema = new mongoose.Schema({
  parentType: { type: String, enum: ['Review', 'Article'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'parentType' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);