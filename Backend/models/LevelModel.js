const mongoose = require('mongoose');

const MultilangStringSchema = new mongoose.Schema({}, { strict: false, _id: false });

const ChapterSchema = new mongoose.Schema({
  ChapterTitle: { type: MultilangStringSchema, required: true }
}, { _id: false });

const LessonSchema = new mongoose.Schema({
  lessonTitle: { type: MultilangStringSchema, required: true },
  Chapters: { type: [ChapterSchema], required: true }
}, { _id: false });

const CategorySchema = new mongoose.Schema({
  categoryName: { type: MultilangStringSchema, required: true },
  lessons: { type: [LessonSchema], required: true }
}, { _id: false });

const LevelSchema = new mongoose.Schema({
  levelName: { type: MultilangStringSchema, required: true },
  categories: { type: [CategorySchema], required: true }
});

module.exports = mongoose.model('Levels', LevelSchema, 'Levels');