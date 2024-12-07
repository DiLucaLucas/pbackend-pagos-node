const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const MetodoPago = sequelize.define(
  "MetodoPago",
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
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "MetodoPago",
  }
);

module.exports = MetodoPago;
