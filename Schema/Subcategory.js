const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  socialLinks: {
    twitter: {
      type: String,
      trim: true
    },
    discord: {
      type: String,
      trim: true
    },
    webLink: {
      type: String,
      trim: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subcategory', subcategorySchema);