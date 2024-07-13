const { sequelize, Sequelize } = require("../services/db.service");
const FoodItem = require("./foodItems.model");

const MealWeekDay = require("./mealWeekDays.model");
const { DataTypes } = Sequelize;

const Meal = sequelize.define("meals", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  dayId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
// Meal.belongsToMany(FoodItem, { through: 'mealFoodItems' });
Meal.belongsTo(MealWeekDay, {
  foreignKey: "dayId",
  as: "day",
  allowNull: false
});


module.exports = Meal;


