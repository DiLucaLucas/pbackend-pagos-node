const Rol = require("../models/Rol");
const MetodoPago = require("../models/MetodoPago");
const EstadoPago = require("../models/EstadoPago");

async function datosIniciales() {
  try {
    // Roles
    const roles = [
      { id: 1, nombre: "SuperUsuario", descripcion: "Superusuario" },
      {
        id: 2,
        nombre: "Administrador",
        descripcion: "Administrador del sistema",
      },
      { id: 3, nombre: "Usuario", descripcion: "Usuario del sistema" },
    ];
    for (const rol of roles) {
      const [rolCreado, creado] = await Rol.findOrCreate({
        where: { id: rol.id },
        defaults: rol,
      });

      if (creado) {
        console.log(`Rol ${rol.nombre} creado con éxito`);
      } else {
        console.log(`Rol ${rol.nombre} ya existe`);
      }
    }

    // Inicializar métodos de pago
    const metodosPago = [
      { id: 1, nombre: "Efectivo", descripcion: "Pago en efectivo" },
      { id: 2, nombre: "Débito", descripcion: "Pago con tarjeta de débito" },
      { id: 3, nombre: "Crédito", descripcion: "Pago con tarjeta de crédito" },
    ];

    for (const metodo of metodosPago) {
      const [metodoCreado, creado] = await MetodoPago.findOrCreate({
        where: { id: metodo.id },
        defaults: metodo,
      });

      if (creado) {
        console.log(`Método de pago ${metodo.nombre} creado con éxito`);
      } else {
        console.log(`Método de pago ${metodo.nombre} ya existe`);
      }
    }

    // Inicializar estados de pago
    const estadosPago = [
      {
        id: 1,
        nombre: "Pendiente",
        descripcion: "Pago pendiente de procesamiento",
      },
      { id: 2, nombre: "Rechazado", descripcion: "Pago rechazado" },
      { id: 3, nombre: "Aprobado", descripcion: "Pago aprobado y procesado" },
    ];

    for (const estado of estadosPago) {
      const [estadoCreado, creado] = await EstadoPago.findOrCreate({
        where: { id: estado.id },
        defaults: estado,
      });

      if (creado) {
        console.log(`Estado de pago ${estado.nombre} creado con éxito`);
      } else {
        console.log(`Estado de pago ${estado.nombre} ya existe`);
      }
    }

    console.log("Inicialización de datos completada");
  } catch (error) {
    console.error("Error al inicializar datos:", error);
  }
}

module.exports = datosIniciales;
