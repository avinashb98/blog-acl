const router = require('express').Router();
const PostController = require('../controllers/post');
const token = require('../middlewares/jwt');
const { checkPermissions } = require('../middlewares/acl');

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
router.post('/', PostController.addPost);

router.put('/:cuid', PostController.updatePost);

// Delete a post by cuid
router.delete('/:cuid', PostController.deletePost);

module.exports = router;
