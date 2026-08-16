// src/routes/calificaciones.routes.js
const express = require('express');
const router = express.Router();
const { calificaciones, solicitudes } = require('../models/datos');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// POST /api/calificaciones -> +guardar() / +Calificar()
// Solo accesible por el CLIENTE
router.post('/', verificarToken, permitirRoles('CLIENTE'), (req, res) => {
    const { id_solicitud, puntuacion, comentario } = req.body;

    // 1. Validar campos requeridos y rango de puntuación
    if (!id_solicitud || !puntuacion) {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y puntuacion (1 a 5)." });
    }

    if (puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: "La puntuación debe ser un valor entero entre 1 y 5." });
    }

    // 2. Verificar que la solicitud existe y pertenece al cliente autenticado
    const solicitud = solicitudes.find(
        s => s.id_solicitud === parseInt(id_solicitud) && s.id_cliente === req.usuario.id
    );

    if (!solicitud) {
        return res.status(404).json({ error: "Solicitud no encontrada o no pertenece a este cliente." });
    }

    // 3. Validar que la solicitud esté en estado finalizado/cerrado
    if (solicitud.estado !== 'CERRADO' && solicitud.estado !== 'ACEPTADO') {
        return res.status(400).json({ error: "Solo se pueden calificar solicitudes finalizadas o aceptadas." });
    }

    // 4. Evitar calificaciones duplicadas para la misma solicitud
    const existeCalificacion = calificaciones.some(c => c.id_solicitud === parseInt(id_solicitud));
    if (existeCalificacion) {
        return res.status(400).json({ error: "Esta solicitud ya ha sido calificada anteriormente." });
    }

    // 5. Crear y guardar la calificación
    const nuevaCalificacion = {
        id_calificacion: calificaciones.length + 1,
        puntuacion: parseInt(puntuacion),
        comentario: comentario || "",
        id_solicitud: parseInt(id_solicitud),
        id_cliente: req.usuario.id,
        fecha: new Date()
    };

    calificaciones.push(nuevaCalificacion);

    res.status(201).json({
        mensaje: "Calificación registrada con éxito",
        calificacion: nuevaCalificacion
    });
});

// GET /api/calificaciones/solicitud/:id_solicitud -> Consulta pública de calificación por solicitud
router.get('/solicitud/:id_solicitud', (req, res) => {
    const idSolicitud = parseInt(req.params.id_solicitud);
    const calificacion = calificaciones.find(c => c.id_solicitud === idSolicitud);

    if (!calificacion) {
        return res.status(404).json({ error: "No se encontró calificación para esta solicitud." });
    }

    res.json(calificacion);
});

module.exports = router;