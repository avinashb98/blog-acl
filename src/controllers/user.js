const User = require('../models/user');
const {
  generatePassword
} = require('./utils');
const { acl } = require('../middlewares/acl');

const register = async (req, res) => {
  const { userId } = req.body;

  const password = generatePassword();
  const role = req.originalUrl.split('/')[3];
  console.log(role);
  let user;
  try {
    user = await User.create({ userId, password, role });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }
  res.status(201).json({
    message: 'Guest User Successfully created',
    data: {
      id: user.userId,
      password
    }
  });
  await acl.addUserRoles(userId, role);
};

const login = async (req, res, next) => {
  const { userId } = req.parsed;
  let user = null;
  try {
    user = await User.findOne({ userId });
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }

  if (user === null || (user.password !== req.parsed.password)) {
    res.status(403).json({
      message: 'Username or password do not match'
    });
    return;
  }
  next();
};

module.exports = {
  register,
  login
};
