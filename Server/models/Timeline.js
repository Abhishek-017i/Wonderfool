const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  actionType: { 
    type: String, 
    enum: ['completed', 'started', 'rated', 'reviewed', 'added_note'], 
    default: 'started' 
  },
  progress: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  note: { type: String, default: '' },
}, { timestamps: true });

timelineSchema.index({ userId: 1, seriesId: 1 }, { unique: true });

module.exports = mongoose.model('Timeline', timelineSchema);
