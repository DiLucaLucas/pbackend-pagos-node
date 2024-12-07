const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const bcrypt = require("bcrypt");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    idrol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ultima_conexion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "Usuario",
  }
);

// Encriptaremos las contraseñas antes de crear el usuario
Usuario.prototype.validPassword = async function (contrasena) {
  if (!contrasena || !this.contrasena) {
    throw new Error("Las contraseñas no coinciden");
  }
  return await bcrypt.compare(contrasena, this.contrasena);
};

// Método para validar contraseña
Usuario.prototype.validPassword = async function (contrasena) {
  if (!contrasena || !this.contrasena) {
    throw new Error("Datos de contraseña no válidos");
  }
  return await bcrypt.compare(contrasena, this.contrasena);
};

module.exports = Usuario;
