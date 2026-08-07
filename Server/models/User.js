const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, required: true, unique: true },
  avatar: String,
  bio: { type: String, default: '' },
  banner: { type: String, default: '' },
  location: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  rank: { type: String, default: 'Newbie' },
  website: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);