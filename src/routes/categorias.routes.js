// src/routes/categorias.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// GET /api/categorias -> Listar todas las categorías de servicios
router.get('/', async (req, res) => {
    try {
        const [categorias] = await pool.query(
            'SELECT id_categoria, nombre FROM Categoria'
        );
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar las categorías.", detalle: error.message });
    }
});

// GET /api/categorias/:id -> Consultar una categoría específica
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [categorias] = await pool.query(
            'SELECT id_categoria, nombre FROM Categoria WHERE id_categoria = ?',
            [id]
        );

        if (categorias.length === 0) {
            return res.status(404).json({ error: "Categoría no encontrada." });
        }

        res.json(categorias[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la categoría.", detalle: error.message });
    }
});

// POST /api/categorias -> Crear una nueva categoría
router.post('/', verificarToken, async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: "El campo nombre es obligatorio." });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO Categoria (nombre) VALUES (?)',
            [nombre]
        );

        res.status(201).json({
            mensaje: "Categoría creada exitosamente en MySQL",
            id_categoria: result.insertId,
            nombre
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría.", detalle: error.message });
    }
});

module.exports = router;