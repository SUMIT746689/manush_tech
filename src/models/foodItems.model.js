const { sequelize, Sequelize } = require("../services/db.service");
const FoodCategory = require("./foodCategories.model");
const Meal = require("./meals.model");

// const MealWeekDayModel = require("..model");
const { DataTypes } = Sequelize;

const FoodItem = sequelize.define("foodItems", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  foodCategoryId: {
    type: DataTypes.INTEGER,
  },
});

FoodItem.belongsToMany(Meal, { through: 'mealFoodItems' });
FoodItem.belongsTo(FoodCategory, {
  foreignKey: "foodCategoryId",
  as: "foodCategory",
});


module.exports = FoodItem;