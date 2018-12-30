const Acl = require('acl');
const User = require('../models/user');

// eslint-disable-next-line new-cap
const acl = new Acl(new Acl.memoryBackend());


/**           Access Control logic
 *
 *            View  Add   Edit  Remove
 * Admin      1     1     1     1
 * Author     1     1     1     0
 * Subscriber 1     1     0     0
 * Guest      1     0     0     0
 *
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

// Reassign roles to the users on server restart
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

// Get resoure name from the url
const getResource = url => `${url.split('/').splice(0, 3).join('/')}/`;

// Permissions middleware
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
  acl,
  checkPermissions
};
