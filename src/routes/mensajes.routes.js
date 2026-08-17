// src/routes/mensajes.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken } = require('../middlewares/auth.middleware');

// GET /api/mensajes/solicitud/:id_solicitud -> Consultar historial de mensajes de una solicitud
router.get('/solicitud/:id_solicitud', verificarToken, async (req, res) => {
    const { id_solicitud } = req.params;

    try {
        const [mensajes] = await pool.query(
            'SELECT * FROM Mensaje WHERE Id_solicitud = ? ORDER BY fechaHora ASC',
            [id_solicitud]
        );

        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los mensajes.", detalle: error.message });
    }
});

// POST /api/mensajes -> Enviar un nuevo mensaje dentro de una solicitud
router.post('/', verificarToken, async (req, res) => {
    const { id_solicitud, contenido } = req.body;

    if (!id_solicitud || !contenido) {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y contenido." });
    }

    try {
        // 1. Validar existencia de la solicitud
        const [solicitud] = await pool.query(
            'SELECT * FROM Solicitud WHERE Id_solicitud = ?',
            [id_solicitud]
        );

        if (solicitud.length === 0) {
            return res.status(404).json({ error: "Solicitud no encontrada." });
        }

        // 2. Insertar mensaje en MySQL
        const [result] = await pool.query(
            'INSERT INTO Mensaje (contenido, Id_solicitud) VALUES (?, ?)',
            [contenido, id_solicitud]
        );

        res.status(201).json({
            mensaje: "Mensaje enviado exitosamente",
            id_mensaje: result.insertId,
            contenido,
            id_solicitud: parseInt(id_solicitud),
            fechaHora: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: "Error al enviar el mensaje.", detalle: error.message });
    }
});

module.exports = router;