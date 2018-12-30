const Acl = require('acl');
const User = require('../models/user');

// eslint-disable-next-line new-cap
const acl = new Acl(new Acl.memoryBackend());

acl.allow([
  {
    roles: ['admin'],
    allows: [
      { resources: ['/api/post/'], permissions: ['get', 'put', 'delete', 'post'] }
    ]
  },
  {
    roles: ['author'],
    allows: [
      { resources: ['post'], permissions: ['get', 'put', 'post'] }
    ]
  },
  {
    roles: ['subscriber'],
    allows: [
      { resources: ['post'], permissions: ['get', 'put'] }
    ]
  },
  {
    roles: ['guest'],
    allows: [
      { resources: ['/api/post/', '/api/post/*'], permissions: ['get'] }
    ]
  }
]);

const addRoles = async () => {
  const users = await User.find();
  users.forEach((user) => {
    acl.addUserRoles(user.userId, user.role, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Added', user.role, 'role to user', user.userId);
    });
  });
};

(async () => {
  await addRoles();
})();


const checkPermissions = (req, res, next) => {
  if (req.decoded) {
    acl.isAllowed(
      req.decoded.userId,
      req.originalUrl,
      req.method.toLowerCase(),
      (error, allowed) => {
        if (allowed) {
          console.log('Authorization passed');
          next();
        } else {
          console.log('Authorization failed');
          res.send({ message: 'Insufficient permissions to access resource' });
        }
      }
    );
  } else {
    res.send({ message: 'User not authenticated' });
  }
};

module.exports = {
  checkPermissions
};
