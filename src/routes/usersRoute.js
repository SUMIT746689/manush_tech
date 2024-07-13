const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const { verifyUser, verifyRole } = require('../middlewares/logging.middleware');

/* GET users */
router.get('/', verifyUser, verifyRole, usersController.get);

/* POST user */
router.post('/', usersController.create);

/* PATCH user */
router.patch('/:id', verifyUser, verifyRole, usersController.update);

/* DELETE user */
router.delete('/:id', verifyUser, verifyRole, usersController.remove);

module.exports = router;
