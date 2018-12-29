const router = require('express').Router();
const userController = require('../controllers/user');
const validator = require('../controllers/validators/userValidators');
const token = require('../middlewares/jwt');

router.post('/register', validator.register, userController.register);
router.post('/login', validator.login, userController.login, token.sendToken);

module.exports = router;
