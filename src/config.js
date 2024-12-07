const { config } = require("dotenv");

config();

// Conexión al server
module.exports = {
  host: process.env.db_host,
  port: process.env.db_port,
  database: process.env.db_database,
  user: process.env.db_user,
  password: process.env.db_password,
  secretKey: process.env.secret_seed,
};
