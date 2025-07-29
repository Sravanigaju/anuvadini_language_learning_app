// models/SlideContent.js
const mongoose = require('mongoose');

// Schema for individual slide content
const slideContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  def: {
    type: String,
    default: '',
    trim: true
  },
  example: {
    type: String,
    default: '',
    trim: true
  },
  image_description: {
    type: String,
    default: '',
    trim: true
  },
  media_id: {
    type: String,
    default: '',
    trim: true
  },
  chapterId: {
    type: String,
    trim: true
  }
}, { _id: false });

// Schema for slides in different languages
const slidesSchema = new mongoose.Schema({
  english: [slideContentSchema],
  hindi: [slideContentSchema],
  sanskrit: [slideContentSchema],
  bengali: [slideContentSchema],
  marathi: [slideContentSchema],
  tamil: [slideContentSchema],
  telugu: [slideContentSchema],
  assamese: [slideContentSchema],
  bodo: [slideContentSchema],
  santali: [slideContentSchema],
  urdu: [slideContentSchema],
  kannada: [slideContentSchema],
  malayalam: [slideContentSchema],
  punjabi: [slideContentSchema],
  maithili: [slideContentSchema],
  dogri: [slideContentSchema],
  manipuri: [slideContentSchema],
  konkani: [slideContentSchema],
  odia: [slideContentSchema],
  gujrati: [slideContentSchema],
  kashmiri: [slideContentSchema],
  sindhi: [slideContentSchema],
  nepali: [slideContentSchema]
}, { _id: false });

// Main Chapter schema
const chapterSchema = new mongoose.Schema({
  chapterId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slides: {
    type: slidesSchema,
    required: true
  }
}, {
  timestamps: true,
  collection: 'slides' // <-- Change this to use the "slides" collection
});

// Indexes for better performance
chapterSchema.index({ chapterId: 1 });
chapterSchema.index({ 'slides.english.title': 'text' });

// module.exports = mongoose.model('SlideContent', chapterSchema,"slides");
module.exports = mongoose.model('SlideContent', chapterSchema,"slides");
