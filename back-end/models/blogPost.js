// models/BlogPost.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const BlogPostSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  cover: { type: String, required: true },
  readTime: {
    value: { type: Number, required: true },
    unit: { type: String, required: true }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  content: { type: String, required: true },
  comments: [commentSchema], // embedded
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
