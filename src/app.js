// Express
const express = require("express");
// Morgan
const morgan = require("morgan");
// Cors
const cors = require("cors");
// Variables de entorno
const envs = require("./configuration/envs");
// Rutas
const authRoutes = require('./routes/authRoutes');
// Express
const app = express();

// Cors
app.use(cors());

// Settings
app.set("port", envs.port || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan("dev"));
app.use("/api/auth", authRoutes);


module.exports = app;
