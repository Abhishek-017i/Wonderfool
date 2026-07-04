const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // null if Google-only
  googleId: { type: String }, // null if email-only
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);