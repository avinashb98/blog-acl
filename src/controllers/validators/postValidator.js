const Joi = require('joi');
const Post = require('../../models/post');

const postExists = async (cuid) => {
  let post;
  try {
    post = await Post.find({ cuid });
  } catch (error) {
    throw error;
  }
  if (post.length > 0) {
    return true;
  }
  return false;
};


const ValidatePost = Joi.object().keys({
  title: Joi.string().min(3).max(30).required(),
  content: Joi.string().required()
});

const add = async (req, res, next) => {
  const { error, value } = ValidatePost.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({
      message: 'Title or Content Invalid'
    });
    return;
  }

  req.body = value;
  next();
};

const update = async (req, res, next) => {
  const { cuid } = req.params;
  if (!(await postExists(cuid))) {
    res.status(404).json({
      message: 'Post does not exists'
    });
    return;
  }
  const { error, value } = ValidatePost.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({
      message: 'Title or Content Invalid'
    });
    return;
  }

  req.parsed = value;
  next();
};

const remove = async (req, res, next) => {
  const { cuid } = req.params;
  if (!(await postExists(cuid))) {
    res.status(404).json({
      message: 'Post does not exists'
    });
    return;
  }
  next();
};

module.exports = { add, update, remove };
