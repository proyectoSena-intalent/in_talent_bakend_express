// src/routes/solicitudes.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// GET /api/solicitudes -> Obtener solicitudes del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
    try {
        const { id, rol } = req.usuario;
        let query = '';
        let params = [];

        if (rol === 'CLIENTE') {
            query = `
                SELECT s.Id_solicitud, s.estado, s.FechaCreacion, 
                       p.email AS email_profesional, serv.descripcion AS servicio
                FROM Solicitud s
                INNER JOIN Profesional p ON s.Id_profesional = p.Id_profesional
                INNER JOIN Servicio serv ON s.Id_servicio = serv.Id_servicio
                WHERE s.Id_cliente = ?
            `;
            params = [id];
        } else {
            query = `
                SELECT s.Id_solicitud, s.estado, s.FechaCreacion, 
                       c.nombre AS cliente_nombre, c.email AS cliente_email, serv.descripcion AS servicio
                FROM Solicitud s
                INNER JOIN Cliente c ON s.Id_cliente = c.Id_cliente
                INNER JOIN Servicio serv ON s.Id_servicio = serv.Id_servicio
                WHERE s.Id_profesional = ?
            `;
            params = [id];
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar las solicitudes.", detalle: error.message });
    }
});

// POST /api/solicitudes -> Crear una solicitud (CLIENTE)
router.post('/', verificarToken, permitirRoles('CLIENTE'), async (req, res) => {
    const { id_profesional, id_servicio } = req.body;

    if (!id_profesional || !id_servicio) {
        return res.status(400).json({ error: "Campos requeridos: id_profesional e id_servicio." });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO Solicitud (estado, Id_cliente, Id_profesional, Id_servicio) VALUES ('PENDIENTE', ?, ?, ?)`,
            [req.usuario.id, id_profesional, id_servicio]
        );

        res.status(201).json({
            mensaje: "Solicitud creada exitosamente",
            id_solicitud: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la solicitud.", detalle: error.message });
    }
});

module.exports = router;