const Usuario = require('../models/Usuario');

exports.createUser = async (req, res) => {
    const { nombre, email, contrasena, idrol } = req.body;
    const creadorId = req.user.id;
    const creadorRolId = req.user.idrol;

    try {
        // Verificar permisos
        if (creadorRolId === 3) { 
            return res.status(403).json({ error: 'No tienes permisos para crear usuarios', success: false });
        }

        // Asegurarse de que no se pueda crear un Super Admin
        if (idrol === 1) {
            return res.status(403).json({ error: 'No se puede crear un usuario Super Admin', success: false });
        }

        if (creadorRolId === 2 && idrol !== 3) { 
            return res.status(403).json({ error: 'Los administradores solo pueden crear usuarios comunes', success: false });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El usuario ya está registrado', success: false });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            contrasena,
            idrol: creadorRolId === 1 ? idrol : 3,
            estado: true,
            creado_por: creadorId
        });

        // Excluir campos sensibles
        const { contrasena: _, ...usuarioData } = nuevoUsuario.dataValues;

        res.status(201).json({ 
            usuario: usuarioData, 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario', success: false });
    }
};

// Editar un nuevo usuario
exports.editUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, idrol, estado } = req.body; 
    const editorRol = req.user.idrol;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado', success: false });
        }

        // Verificar permisos
        if (editorRol === 3) {
            return res.status(403).json({ error: 'No tienes permisos para editar usuarios', success: false });
        }

        // Asegurarse de que no se pueda cambiar a Super Admin
        if (idrol === 1) {
            return res.status(403).json({ error: 'No se puede asignar el rol de Super Admin', success: false });
        }

        if (editorRol === 2 && (usuario.idrol !== 3 || idrol !== 3)) {
            return res.status(403).json({ error: 'Los administradores solo pueden editar usuarios comunes', success: false });
        }

        // Actualizar usuario
        await usuario.update({
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            idrol: editorRol === 1 ? (idrol || usuario.idrol) : usuario.idrol,
            estado: estado !== undefined ? estado : usuario.estado,
            fecha_actualizacion: new Date()
        });

        // Excluir campos sensibles
        const { contrasena: _, ...usuarioData } = usuario.dataValues;

        res.status(200).json({ 
            usuario: usuarioData, 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar el usuario', success: false });
    }
};

// Delete Usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const eliminadorRol = req.user.idrol;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado', success: false });
        }

        // Verificar permisos 
        if (eliminadorRol === 3) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar usuarios', success: false });
        }

        if (eliminadorRol === 2 && usuario.idrol !== 3) {
            return res.status(403).json({ error: 'Los administradores solo pueden eliminar usuarios comunes', success: false });
        }

        // Eliminar usuario
        await usuario.destroy();

        res.status(200).json({ 
            message: 'Usuario eliminado con éxito', 
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario', success: false });
    }
};
// Get Usuarios
exports.getUsers = async (req, res) => {
    const solicitanteRolId = req.user.idrol;
    const { pagina = 1, limite = 10, ordenarPor = 'id', orden = 'ASC' } = req.query;

    try {
        let opciones = {
            attributes: { exclude: ['contrasena'] },
            order: [[ordenarPor, orden]],
            limit: parseInt(limite),
            offset: (parseInt(pagina) - 1) * parseInt(limite)
        };

        // Si el usuario es superadmin, puede ver todos los usuarios
        if (solicitanteRolId === 1) {
            // No se necesita modificar las opciones
        } else if (solicitanteRolId === 2) {
            // Si el usuario es admin, puede ver solo los usuarios comunes
            opciones.where = { idrol: 3 };
        } else {
            return res.status(403).json({ error: 'No tienes permisos para ver la lista de usuarios', success: false });
        }

        const { count, rows: usuarios } = await Usuario.findAndCountAll(opciones);

        const totalPaginas = Math.ceil(count / limite);

        res.status(200).json({ 
            usuarios, 
            paginacion: {
                totalUsuarios: count,
                totalPaginas,
                paginaActual: parseInt(pagina),
                usuariosPorPagina: parseInt(limite)
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios', success: false });
    }
};