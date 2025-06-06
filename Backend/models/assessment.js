const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  stageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stage', index: true },
  questions: [
    {
      question: {
        default: String,
        translations: { type: Map, of: String }
      },
      answer: {
        default: String,
        translations: { type: Map, of: String }
      }
    }
  ],
  passScore: Number
});

module.exports = mongoose.model('Assessment', AssessmentSchema);