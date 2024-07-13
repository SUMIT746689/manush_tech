const { sequelize, Sequelize } = require("../services/db.service");

// const MealWeekDayModel = require("..model");
const { DataTypes } = Sequelize;

const FoodCategory = sequelize.define("foodCategories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = FoodCategory;
