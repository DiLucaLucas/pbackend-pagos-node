const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const EstadoPago = sequelize.define(
  "EstadoPago",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "EstadoPago",
    timestamps: false,
  }
);

module.exports = EstadoPago;