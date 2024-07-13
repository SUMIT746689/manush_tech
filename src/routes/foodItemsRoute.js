const express = require('express');
const router = express.Router();

const foodItemsController = require('../controllers/foodItems.controller');
const { verifyUser, verifyRole } = require('../middlewares/logging.middleware');

/* GET users */
router.get('/', verifyUser, verifyRole, foodItemsController.get);

/* POST user */
router.post('/', verifyUser, verifyRole, foodItemsController.create);

/* PATCH user */
router.patch('/:id', verifyUser, verifyRole, foodItemsController.update);

/* DELETE user */
router.delete('/:id', verifyUser, verifyRole, foodItemsController.remove);

module.exports = router;
