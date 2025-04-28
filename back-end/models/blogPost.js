// models/BlogPost.js
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: String, required: true }, // oppure ref ad Author se vuoi il populate
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
