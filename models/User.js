const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema,'hackathon_user');
