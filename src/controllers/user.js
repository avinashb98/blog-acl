const User = require('../models/user');

const register = async (req, res) => {
  const { id } = req.body;
  let user;
  try {
    user = await User.create({ id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error'
    });
    return;
  }
  console.log(user);
  res.status(201).json({
    message: 'Guest User Successfully created'
  });
};

module.exports = {
  register
};
