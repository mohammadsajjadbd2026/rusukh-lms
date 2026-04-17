const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // YouTube embed URL
  sheetLink: { type: String, default: '' }, // Google Drive/Sheet link
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Lesson', lessonSchema);
