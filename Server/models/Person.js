const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');
require('./Series');

const personSchema = new mongoose.Schema({
  name: {
    full: String,
    native: String,
  },

  photo: String,
  bio: String,
  designation: [String],
  yearsActive: String,
  
  knownWorks: [{
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
    designation: String,
  }],
  
  aniListId: { type: Number, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Person', personSchema);