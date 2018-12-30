const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  title: { type: 'String', required: true },
  content: { type: 'String', required: true },
  slug: { type: 'String', required: true },
  cuid: { type: 'String', required: true },
  author: { type: 'String', required: true },
  createdAt: { type: 'Date', default: Date.now, required: true },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
