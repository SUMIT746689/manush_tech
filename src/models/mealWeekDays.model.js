const { sequelize, Sequelize } = require("../services/db.service");

const { DataTypes } = Sequelize;

const MealWeekDay = sequelize.define("mealWeekdays", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  day: {
    type: DataTypes.ENUM('SATERDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'),
    allowNull: false
  }
});

module.exports = MealWeekDay