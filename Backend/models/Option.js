const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String }
});

module.exports = OptionSchema; 