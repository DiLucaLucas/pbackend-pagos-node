const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configuration/envs');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');

/**
 * Middleware de autenticación
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función de middleware siguiente
 */
const auth = async (req, res, next) => {
    // Obtener el token del encabezado de la solicitud
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No hay token, autorización denegada', success: false });
    }

    // Verificar y decodificar el token
    try {
        const decoded = jwt.verify(token, jwtSecret);
        
        const usuario = await Usuario.findByPk(decoded.idusuario, {
            attributes: ['id', 'idrol'],
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['nombre']
            }]
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Token no válido - usuario no encontrado', success: false });
        }

        req.user = {
            id: usuario.id,
            idrol: usuario.idrol
        };
        next();
    } catch (err) {
        console.error('Error al verificar el token:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado', success: false });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token malformado', success: false });
        }
        res.status(401).json({ error: 'Token no válido', success: false });
    }
};

module.exports = auth;