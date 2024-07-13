const dotenv = require("dotenv");
dotenv.config();

const env = process.env;
const fs = require('fs');
const db = {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: "password" || env.DB_PASSWORD,
    database: env.DB_NAME || 'office_meal_managements',
    port: env.DB_PORT || 5432,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    // ssl: {
    //   mode: 'VERIFY_IDENTITY',
    //   ca: fs.readFileSync('/etc/ssl/cert.pem', 'utf-8'),
    // }
};

module.exports = db;
