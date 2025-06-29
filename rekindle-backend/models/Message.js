const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Patient', 'Guardian', 'Care-taker'],
    required: true
  },
  subcommunity: {
    type: String,
    required: true,
    enum: [
      'autism-spectrum',
      'adhd',
      'dyslexia',
      'dyscalculia',
      'dyspraxia',
      'sensory-processing',
      'learning-disabilities',
      'developmental-delays',
      'speech-language',
      'motor-skills',
      'general-support'
    ]
  },
  title: {
    type: String,
    maxlength: 100,
    default: null
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  parentMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Moderation fields
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagCount: {
    type: Number,
    default: 0
  },
  flaggedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'spam', 'harassment', 'other'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isHidden: {
    type: Boolean,
    default: false
  },
  // Engagement metrics
  likeCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Message', messageSchema); 