// src/routes/mensajes.routes.js
const express = require('express');
const router = express.Router();
const { mensajes, solicitudes } = require('../models/datos');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// POST /api/mensajes -> +Enviar()
// Accesible tanto por CLIENTE como por PROFESIONAL
router.post('/', verificarToken, permitirRoles('CLIENTE', 'PROFESIONAL'), (req, res) => {
    const { id_solicitud, contenido } = req.body;

    if (!id_solicitud || !contenido || contenido.trim() === '') {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y contenido." });
    }

    // Verificar que la solicitud exista
    const solicitud = solicitudes.find(s => s.id_solicitud === parseInt(id_solicitud));
    if (!solicitud) {
        return res.status(404).json({ error: "La solicitud asociada no existe." });
    }

    // Validar que el usuario sea el cliente o el profesional de dicha solicitud
    const esCliente = req.usuario.rol === 'CLIENTE' && solicitud.id_cliente === req.usuario.id;
    const esProfesional = req.usuario.rol === 'PROFESIONAL' && solicitud.id_profesional === req.usuario.id;

    if (!esCliente && !esProfesional) {
        return res.status(403).json({ error: "No tienes permiso para enviar mensajes en esta solicitud." });
    }

    const nuevoMensaje = {
        id_mensaje: mensajes.length + 1,
        contenido,
        fechaHora: new Date(),
        leido: false,
        id_solicitud: parseInt(id_solicitud),
        id_emisor: req.usuario.id,
        rol_emisor: req.usuario.rol
    };

    mensajes.push(nuevoMensaje);

    res.status(201).json({
        mensaje: "Mensaje enviado con éxito",
        detalle: nuevoMensaje
    });
});

// GET /api/mensajes/solicitud/:id_solicitud -> Obtener historial de chat
router.get('/solicitud/:id_solicitud', verificarToken, (req, res) => {
    const idSolicitud = parseInt(req.params.id_solicitud);
    const chat = mensajes.filter(m => m.id_solicitud === idSolicitud);

    res.json(chat);
});

// PATCH /api/mensajes/:id/leido -> +MarcarLeido()
router.patch('/:id/leido', verificarToken, (req, res) => {
    const idMensaje = parseInt(req.params.id);
    const mensajeEncontrado = mensajes.find(m => m.id_mensaje === idMensaje);

    if (!mensajeEncontrado) {
        return res.status(404).json({ error: "Mensaje no encontrado." });
    }

    mensajeEncontrado.leido = true;

    res.json({
        mensaje: "El mensaje ha sido marcado como leído",
        detalle: mensajeEncontrado
    });
});

module.exports = router;