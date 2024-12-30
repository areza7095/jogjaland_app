const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Gambar schema
const ImageSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  imageData: {
    type: String, // Ini untuk menyimpan gambar dalam format base64
    required: true,
  },
});

module.exports = mongoose.model('Image', ImageSchema);
