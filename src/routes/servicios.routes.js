// src/routes/servicios.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// GET /api/servicios -> Consultar todos los servicios con su categoría
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.Id_servicio, s.descripcion, s.tarifaPromedio, c.nombre AS categoria, s.id_profesional 
            FROM Servicio s
            INNER JOIN Categoria c ON s.id_categoria = c.id_categoria
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los servicios.", detalle: error.message });
    }
});

// POST /api/servicios -> Crear nuevo servicio (PROFESIONAL)
router.post('/', verificarToken, permitirRoles('PROFESIONAL'), async (req, res) => {
    const { descripcion, tarifaPromedio, id_categoria } = req.body;

    if (!descripcion || !tarifaPromedio || !id_categoria) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const [result] = await pool.query(
            `INSERT INTO Servicio (descripcion, tarifaPromedio, id_categoria, id_profesional) VALUES (?, ?, ?, ?)`,
            [descripcion, tarifaPromedio, id_categoria, req.usuario.id]
        );

        res.status(201).json({
            mensaje: "Servicio creado exitosamente en MySQL",
            id_servicio: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el servicio.", detalle: error.message });
    }
});

module.exports = router;