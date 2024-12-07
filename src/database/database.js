const { Sequelize } = require("sequelize");
const config = require("../config");

// Creamos una nueva instancia de Sequelize

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  logging: false,
});

// Conexión a la bd
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la BD exitosa");
  } catch (error) {
    console.error("Error al conectar a la BD:", error);
  }
};

module.exports = { sequelize, connectDB };
