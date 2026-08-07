const mongoose = require('mongoose');
const verifyToken = require('../middleware/verifyToken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, required: true, unique: true },
  avatar: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);