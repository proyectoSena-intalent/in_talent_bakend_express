// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar si la petición incluye un JWT válido
 */
const verificarToken = (req, res, next) => {
    // 1. Obtener la cabecera 'Authorization'
    const authHeader = req.headers['authorization'] || req.headers['authorization'];

    // 2. Validar que la cabecera exista y comience con 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso denegado. No se proporcionó un token válido.'
        });
    }

    // 3. Extraer el token
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verificar la firma y expiración del token
        const secretKey = process.env.JWT_SECRET || 'secreto_por_defecto';
        const decoded = jwt.verify(token, secretKey);

        // 5. Inyectar la información del usuario en el objeto req
        req.usuario = decoded;

        // 6. Continuar con la ejecución de la ruta
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado. Inicie sesión nuevamente.' });
        }
        return res.status(403).json({ error: 'Token inválido o alterado.' });
    }
};

/**
 * Middleware opcional para restringir acceso por roles (CLIENTE / PROVEEDOR)
 */
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                error: 'No tienes los permisos requeridos para realizar esta acción.' 
            });
        }

        next();
    };
};

module.exports = {
    verificarToken,
    permitirRoles
};