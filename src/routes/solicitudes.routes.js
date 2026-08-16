// src/routes/solicitudes.routes.js
const express = require('express');
const router = express.Router();
const { solicitudes, servicios } = require('../models/datos');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// +Crear_solicitud() -> Ejecutada por el Cliente
router.post('/', verificarToken, permitirRoles('CLIENTE'), (req, res) => {
    const { id_servicio } = req.body;
    const servicioEncontrado = servicios.find(s => s.id_servicio === parseInt(id_servicio));

    if (!servicioEncontrado) {
        return res.status(404).json({ error: "El servicio especificado no existe." });
    }

    const nuevaSolicitud = {
        id_solicitud: solicitudes.length + 1,
        estado: "PENDIENTE",
        FechaCreacion: new Date(),
        id_cliente: req.usuario.id,
        id_profesional: servicioEncontrado.id_profesional,
        id_servicio: servicioEncontrado.id_servicio
    };

    solicitudes.push(nuevaSolicitud);

    res.status(201).json({
        mensaje: "Solicitud creada con éxito",
        solicitud: nuevaSolicitud
    });
});

// +AceptarSolicitud() / +RechazarSolicitud() -> Ejecutada por el Profesional
router.patch('/:id/estado', verificarToken, permitirRoles('PROFESIONAL'), (req, res) => {
    const idSolicitud = parseInt(req.params.id);
    const { nuevoEstado } = req.body; // 'ACEPTADO', 'RECHAZADO', 'CERRADO'

    const solicitud = solicitudes.find(s => s.id_solicitud === idSolicitud && s.id_profesional === req.usuario.id);

    if (!solicitud) {
        return res.status(404).json({ error: "Solicitud no encontrada o no pertenece a este profesional." });
    }

    solicitud.estado = nuevoEstado;

    res.json({
        mensaje: `Estado de la solicitud actualizado a: ${nuevoEstado}`,
        solicitud
    });
});

module.exports = router;