const express = require("express");
const { check, validationResult } = require("express-validator");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Función para validar dominios
const validarDominioEmail = (value) => {
  const dominiosValidos = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "yahoo.com",
    "icloud.com",
  ];
  const dominio = value.split("@")[1];
  if (!dominiosValidos.includes(dominio)) {
    throw new Error("Por favor, utiliza un correo electrónico válido");
  }
  return true;
};

// Validación de campos
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const simplifiedErrors = errors.array().map((error) => ({
      error: error.msg,
      field: error.path,
    }));
    return res.status(400).json({ errores: simplifiedErrors, success: false });
  }
  next();
};

// Ruta de Registro
router.post(
  "/register",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email")
      .isEmail()
      .withMessage("Ingrese un correo válido")
      .custom(validarDominioEmail),
    check(
      "contrasena",
      "La contraseña debe tener al menos 6 caracteres"
    ).isLength({ min: 6 }),
    validate,
  ],
  register
);

//  Ruta de login

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Ingrese un correo válido")
      .custom(validarDominioEmail),
    check("contrasena", "Ingrese su contraseña").exists(),
    validate,
  ],
  login
);

module.exports = router;
