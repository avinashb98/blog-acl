const jwt = require('jsonwebtoken');

const sendToken = (req, res) => {
  jwt.sign(
    { userId: req.parsed.userId },
    process.env.SECRET,
    { expiresIn: '1200s' },
    (err, token) => {
      if (err) {
        res.status(500).json({
          message: 'Error in Login'
        });
        return;
      }
      res.status(200).json({
        message: 'Login Successful',
        token
      });
    }
  );
};

const verifyToken = (req, res, next) => {
  let token = null;
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    // Split at space
    const bearer = bearerHeader.split(' ');
    // get token from array
    const bearerToken = bearer[1];
    token = bearerToken;
  } else {
    res.status(401).json({
      message: 'Did not receive token'
    });
    return;
  }

  jwt.verify(token, process.env.SECRET, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Token Invalid. Forbidden.'
      });
      return;
    }
    next();
  });
};

module.exports = {
  sendToken,
  verifyToken
};
