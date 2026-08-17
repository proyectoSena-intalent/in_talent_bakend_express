// src/routes/calificaciones.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// POST /api/calificaciones -> Registrar calificación (CLIENTE)
router.post('/', verificarToken, permitirRoles('CLIENTE'), async (req, res) => {
    const { id_solicitud, puntuacio } = req.body;

    if (!id_solicitud || puntuacio === undefined) {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y puntuacio." });
    }

    if (puntuacio < 1 || puntuacio > 5) {
        return res.status(400).json({ error: "La puntuación debe ser un valor entre 1 y 5." });
    }

    try {
        // 1. Verificar existencia de la solicitud asociada al cliente autenticado
        const [solicitudes] = await pool.query(
            'SELECT * FROM Solicitud WHERE Id_solicitud = ? AND Id_cliente = ?',
            [id_solicitud, req.usuario.id]
        );

        if (solicitudes.length === 0) {
            return res.status(404).json({
                error: "Solicitud no encontrada o no pertenece al cliente autenticado."
            });
        }

        // 2. Verificar que no exista ya una calificación para esta solicitud
        const [calificacionesExistentes] = await pool.query(
            'SELECT * FROM Calificacion WHERE Id_solicitud = ?',
            [id_solicitud]
        );

        if (calificacionesExistentes.length > 0) {
            return res.status(400).json({ error: "Esta solicitud ya tiene una calificación registrada." });
        }

        // 3. Guardar calificación en MySQL
        const [result] = await pool.query(
            'INSERT INTO Calificacion (puntuacio, Id_solicitud) VALUES (?, ?)',
            [parseInt(puntuacio), id_solicitud]
        );

        res.status(201).json({
            mensaje: "Calificación registrada exitosamente en MySQL",
            id_calificacion: result.insertId,
            puntuacio: parseInt(puntuacio),
            id_solicitud: parseInt(id_solicitud)
        });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la calificación.", detalle: error.message });
    }
});

// GET /api/calificaciones/solicitud/:id_solicitud -> Consultar calificación de una solicitud
router.get('/solicitud/:id_solicitud', verificarToken, async (req, res) => {
    const { id_solicitud } = req.params;

    try {
        const [calificaciones] = await pool.query(
            'SELECT * FROM Calificacion WHERE Id_solicitud = ?',
            [id_solicitud]
        );

        if (calificaciones.length === 0) {
            return res.status(404).json({ error: "No existe registro de calificación para esta solicitud." });
        }

        res.json(calificaciones[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la calificación.", detalle: error.message });
    }
});

module.exports = router;