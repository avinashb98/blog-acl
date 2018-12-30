const router = require('express').Router();
const PostController = require('../controllers/post');
const token = require('../middlewares/jwt');
const { checkPermissions } = require('../middlewares/acl');
const validate = require('../controllers/validators/postValidator');

router.use(token.verifyToken);

// Get all Posts
router.get(
  '/',
  checkPermissions,
  PostController.getAll
);

// Get one post by cuid
router.get(
  '/:cuid',
  checkPermissions,
  PostController.getPost
);

// Add a new Post
router.post('/', validate.add, PostController.addPost);

router.put('/:cuid', validate.update, PostController.updatePost);

// Delete a post by cuid
router.delete('/:cuid', validate.remove, PostController.deletePost);

module.exports = router;
