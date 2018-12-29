const Joi = require('joi');
const User = require('../../models/user');

const userWithIdExists = async (userId) => {
  let user;
  try {
    user = await User.find({ userId });
  } catch (error) {
    throw error;
  }
  if (user.length > 0) {
    return true;
  }
  return false;
};

const ValidateRegister = Joi.object().keys({
  userId: Joi.string().min(3).max(30).required()
});

const register = async (req, res, next) => {
  const { error, value } = ValidateRegister.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({
      message: 'Invalid User Id'
    });
    return;
  }

  if (await userWithIdExists(value.userId)) {
    res.status(400).json({
      message: 'This user id is already registered with another user'
    });
    return;
  }

  req.parsed = value;
  next();
};

const ValidateLogin = Joi.object().keys({
  userId: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(30).required()
});

const login = async (req, res, next) => {
  const { error, value } = ValidateLogin.validate(req.body);
  if (error) {
    console.log(error);
    res.status(400).json({
      message: 'Invalid Input Format'
    });
    return;
  }

  if (!(await userWithIdExists(value.userId))) {
    res.status(404).json({
      message: 'This user does not exist'
    });
    return;
  }

  req.parsed = value;
  next();
};
module.exports = { register, login };
