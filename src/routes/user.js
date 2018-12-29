const router = require('express').Router();
const userController = require('../controllers/user');

router.post('/', userController.register);

module.exports = router;
