const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  time: { type: Date, required: true },
  delivered: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reminder', reminderSchema); 