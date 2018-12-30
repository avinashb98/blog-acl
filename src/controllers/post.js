const slug = require('limax');
const cuid = require('cuid');
const Post = require('../models/post');

const getAll = async (req, res) => {
  let posts;
  try {
    posts = await Post.find().sort('-createdAt');
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }

  res.status(200).json({
    message: 'List of posts',
    data: {
      posts
    }
  });
};

const getPost = async (req, res) => {
  let post;
  try {
    post = await Post.findOne({ cuid: req.params.cuid });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }

  res.status(200).json({
    message: 'Post Details',
    data: {
      post
    }
  });
};

const addPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.decoded;

  const newPost = new Post({
    title, content
  });

  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();
  newPost.author = userId;

  try {
    await newPost.save();
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }
  res.status(201).json({
    message: 'Added new Post',
    data: {
      newPost
    }
  });
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;
  let post;
  try {
    post = await Post.findOne({ cuid: req.params.cuid });
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }

  res.status(200).json({
    message: 'Post Updated',
    data: {
      post
    }
  });
};

const deletePost = async (req, res) => {
  let post;
  try {
    post = await Post.findOne({ cuid: req.params.cuid });
    await post.remove();
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }
  res.status(201).json({
    message: 'Delete successful'
  });
};

module.exports = {
  getAll,
  getPost,
  addPost,
  deletePost,
  updatePost
};
