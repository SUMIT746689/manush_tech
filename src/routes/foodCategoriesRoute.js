const express = require('express');
const router = express.Router();

const foodCategoriesController = require('../controllers/foodCategories.controller');
const { verifyUser, verifyRole } = require('../middlewares/logging.middleware');

/* GET users */
router.get('/', verifyUser, verifyRole, foodCategoriesController.get);

/* POST user */
router.post('/', verifyUser, verifyRole, foodCategoriesController.create);

/* PATCH user */
router.patch('/:id', verifyUser, verifyRole, foodCategoriesController.update);

/* DELETE user */
router.delete('/:id', verifyUser, verifyRole, foodCategoriesController.remove);

module.exports = router;
