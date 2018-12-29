const router = require('express').Router();
const userController = require('../controllers/user');
const validator = require('../controllers/validators/userValidators');

router.post('/register', validator.register, userController.register);

module.exports = router;
