const router = require('express').Router();
const PostController = require('../controllers/post');

// Get all Posts
router.get('/', PostController.getAll);

// Get one post by cuid
router.get('/:cuid', PostController.getPost);

// Add a new Post
router.post('/', PostController.addPost);

router.put('/:cuid', PostController.updatePost);

// Delete a post by cuid
router.delete('/:cuid', PostController.deletePost);

module.exports = router;
