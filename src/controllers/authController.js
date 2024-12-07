const jwt = require("jsonwebtoken");
// Importamos e instanciamos el modelo Usuario
const Usuario = require("../models/Usuario");
const Rol = require('./../models/Rol');
const { jwtSecret } = require("../configuration/envs");

exports.register = async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  try {
    // Verificaremos si el usuario ya existe en nuestra BD
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ mensaje: "El usuario ya existe", success: false });
    }
    // Obtener el rol del usuario
    const rolUsuario = await Rol.findByPk(3);
    if (!rolUsuario) {
      return res
        .status(500)
        .json({ error: "Error al brindar rol de usuario", success: false });
    }
    const usuario = await Usuario.create({
      nombre,
      email,
      contrasena,
      idrol: rolUsuario.id,
      estado: true,
    });

    // Excluir campos sensibles
    const {
      contrasena: _,
      idrol,
      estado,
      fecha_creacion,
      fecha_actualizacion,
      ...usuarioData
    } = usuario.dataValues;

    // Generar el token JWT
    const payload = { idusuario: usuario.id, idrol: usuario.idrol };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    // Enviar la respuesta
    res.status(200).json({ usuario: usuarioData, token, success: true });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al registrar el usuario", success: false });
  }
};

exports.login = async (req, res) => {
  const { email, contrasena } = req.body;

  // Verificar si el email o la contraseña están faltando
  if (!email || !contrasena) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son requeridos", success: false });
  }

  try {
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res
        .status(400)
        .json({ error: "Credenciales inválidas", success: false });
    }

    // Verificar la contraseña
    const isMatch = await usuario.validPassword(contrasena);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Credenciales inválidas", success: false });
    }

    // Generar el token JWT
    const payload = { idusuario: usuario.id, idrol: usuario.idrol };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    const {
      contrasena: _,
      tipo,
      estado,
      ultima_conexion,
      fecha_creacion,
      fecha_actualizacion,
      ...usuarioData
    } = usuario.dataValues;
    res.status(200).json({ usuario: usuarioData, token, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión", success: false });
  }
};
