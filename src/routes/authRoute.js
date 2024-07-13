const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { verifyUser } = require('../middlewares/logging.middleware');

/* GET programming languages. */
// router.get('/', usersController.get);

/* login user */
router.get('/verify', verifyUser, authController.verify);
router.post('/login', authController.login);

/* PUT programming language */
// router.put('/:id', usersController.update);

/* DELETE programming language */
// router.delete('/:id', usersController.remove);

module.exports = router;
