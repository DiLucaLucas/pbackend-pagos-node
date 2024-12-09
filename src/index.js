const app = require("./app");
const { connectDB, sequelize } = require("./database/database");
require("./models/relaciones.js");
const datosIniciales = require("./database/datosIniciales");

const main = async () => {
  try {
    await connectDB();

    // Sincronizamos los modelos
    await sequelize.sync();
    console.log("Modelos sincronizados con la BD");

    await datosIniciales();

    app.listen(app.get("port"), () => {
      console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
    });
  } catch (error) {
    console.log("Error al iniciar el servidor", error);
    process.exit(1);
  }
};

main();
