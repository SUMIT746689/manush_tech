const dbConfig = require('../configs/db.config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  // dialectOptions: { useUTC: false },
  // operatorsAliases: false,
  // timeZone: "+6:00",
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  }
});

// const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/dbname');

module.exports = { sequelize, Sequelize };
