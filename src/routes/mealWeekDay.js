const express = require('express');
const router = express.Router();

const mealWeekDaysController = require('../controllers/mealWeekDays.controller');
const { verifyUser, verifyRole } = require('../middlewares/logging.middleware');

/* GET users */
router.get('/', verifyUser, verifyRole, mealWeekDaysController.get);

/* POST user */
router.post('/', verifyUser, verifyRole, mealWeekDaysController.create);

/* PATCH user */
router.patch('/:id', verifyUser, verifyRole, mealWeekDaysController.update);

/* DELETE user */
router.delete('/:id', verifyUser, verifyRole, mealWeekDaysController.remove);

module.exports = router;
