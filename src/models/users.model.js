const { sequelize, Sequelize } = require("../services/db.service");

// const MealWeekDayModel = require("..model");
const { DataTypes } = Sequelize;

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'GENERAL'),
    defaultValue: 'GENERAL',
    allowNull: false
  },
  isBanned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});
module.exports = User;
