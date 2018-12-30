const Acl = require('acl');
const User = require('../models/user');

// eslint-disable-next-line new-cap
const acl = new Acl(new Acl.memoryBackend());

acl.allow([
  {
    roles: ['admin'],
    allows: [
      { resources: '/api/post/', permissions: ['get', 'put', 'post', 'delete'] }
    ]
  },
  {
    roles: ['author'],
    allows: [
      { resources: ['/api/post/'], permissions: ['get', 'put', 'post'] }
    ]
  },
  {
    roles: ['subscriber'],
    allows: [
      { resources: ['/api/post/'], permissions: ['get', 'put'] }
    ]
  },
  {
    roles: ['guest'],
    allows: [
      { resources: ['/api/post/'], permissions: ['get'] }
    ]
  }
]);

const addRoles = async () => {
  const users = await User.find();
  users.forEach(async (user) => {
    await acl.addUserRoles(user.userId, user.role);
    console.log('Added', user.role, 'role to user', user.userId);
  });
};

(async () => {
  await addRoles();
})();

const getResource = url => `${url.split('/').splice(0, 3).join('/')}/`;

const checkPermissions = (req, res, next) => {
  if (req.decoded) {
    acl.isAllowed(
      req.decoded.userId,
      getResource(req.originalUrl),
      req.method.toLowerCase(),
      (error, allowed) => {
        if (allowed) {
          console.log('Authorization passed');
          next();
        } else {
          console.log('Authorization failed');
          res.status(403).json({
            message: 'Insufficient permissions to access resource'
          });
        }
      }
    );
  } else {
    res.status(401).json({
      message: 'User not authenticated'
    });
  }
};

module.exports = {
  checkPermissions
};
