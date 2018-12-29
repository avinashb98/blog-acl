const User = require('../models/user');
const {
  generatePassword
} = require('./utils');

const register = async (req, res) => {
  const { userId } = req.body;

  const password = generatePassword();
  console.log(password);

  let user;
  try {
    user = await User.create({ userId, password });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }
  console.log(user);
  res.status(201).json({
    message: 'Guest User Successfully created',
    data: {
      id: user.userId,
      password
    }
  });
};

module.exports = {
  register
};
