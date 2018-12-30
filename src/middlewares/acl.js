const Acl = require('acl');

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
  acl,
  checkPermissions
};
