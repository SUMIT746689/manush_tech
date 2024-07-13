const { sequelize, Sequelize } = require("../services/db.service");
const FoodItem = require("./foodItems.model");
const User = require("./users.model");
const { DataTypes } = Sequelize;

const MealOrder = sequelize.define("mealOrders", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
// Meal.belongsToMany(FoodItem, { through: 'mealFoodItems' });
MealOrder.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  allowNull: false
});
MealOrder.belongsToMany(FoodItem, { through: 'mealOrderFoodItems' });


module.exports = MealOrder;


