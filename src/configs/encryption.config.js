const dotenv = require("dotenv");
dotenv.config();

const env = process.env;

const encryptionSecrets = {
    jwtSecretKey: env.JWT_SECRET_KEY
};

module.exports = encryptionSecrets;
