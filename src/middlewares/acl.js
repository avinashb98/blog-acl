const Acl = require('acl');
const User = require('../models/user');

// eslint-disable-next-line new-cap
const acl = new Acl(new Acl.memoryBackend());

/**
 *            View  Add   Edit  Remove
 * Admin      1     1     1     1
 * Author     1     1     1     0
 * Subscriber 1     1     0     0
 * Guest      1     0     0     0
 */


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

User
  .find()
  .exec()
  .then((users) => {
    users.forEach((user) => {
      acl.addUserRoles(user.userId, user.role, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });

const getResource = url => `${url.split('/').splice(0, 3).join('/')}/`;

const checkPermissions = (req, res, next) => {
  if (req.decoded) {
    acl.isAllowed(
      req.decoded.userId,
      getResource(req.originalUrl),
      req.method.toLowerCase(),
      (error, allowed) => {
        console.log(req.decoded.userId,
          getResource(req.originalUrl),
          req.method.toLowerCase());
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
  acl,
  checkPermissions
};
