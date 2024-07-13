const { sequelize } = require("../services/db.service.js")

const testDbConnection = async () => {
    try {
        console.log({ dbConfig })
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
}

const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
db.testDbConnection = testDbConnection;

// db.User = require("./users.model.js")(sequelize, Sequelize.DataTypes);
db.User = require("./users.model.js");
db.FoodItem = require("./foodItems.model.js");
db.FoodCategory = require("./foodCategories.model.js");
db.MealWeekDay = require("./mealWeekDays.model.js");
db.Meal = require("./meals.model.js");
db.MealOrder = require("./mealOrders.model.js");

// db.MealWeekDay.hasMany(db.Meal, { as: "meals" });

module.exports = db;
