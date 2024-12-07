const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Recibo = sequelize.define(
  "Recibo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idpago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path_archivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fecha_subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estado_recibo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "Recibo",
  }
);

module.exports = Recibo;
