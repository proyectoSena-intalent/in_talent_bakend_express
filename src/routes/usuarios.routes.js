// src/routes/usuarios.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// GET /api/usuarios/clientes -> Listar todos los clientes
router.get('/clientes', verificarToken, async (req, res) => {
    try {
        const [clientes] = await pool.query(
            'SELECT Id_cliente, nombre, email FROM Cliente'
        );
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los clientes.", detalle: error.message });
    }
});

// GET /api/usuarios/profesionales -> Listar todos los profesionales
router.get('/profesionales', async (req, res) => {
    try {
        const [profesionales] = await pool.query(
            'SELECT Id_profesional, email, tarifaBase FROM Profesional'
        );
        res.json(profesionales);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar los profesionales.", detalle: error.message });
    }
});

// POST /api/usuarios/clientes -> Registrar un nuevo cliente
router.post('/clientes', async (req, res) => {
    const { nombre, email } = req.body;

    if (!nombre || !email) {
        return res.status(400).json({ error: "Los campos nombre y email son obligatorios." });
    }

    try {
        // Verificar duplicado por email
        const [existente] = await pool.query(
            'SELECT Id_cliente FROM Cliente WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
        }

        const [result] = await pool.query(
            'INSERT INTO Cliente (nombre, email) VALUES (?, ?)',
            [nombre, email]
        );

        res.status(201).json({
            mensaje: "Cliente registrado exitosamente en MySQL",
            id_cliente: result.insertId,
            nombre,
            email
        });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el cliente.", detalle: error.message });
    }
});

// POST /api/usuarios/profesionales -> Registrar un nuevo profesional
router.post('/profesionales', async (req, res) => {
    const { email, tarifaBase } = req.body;

    if (!email || tarifaBase === undefined) {
        return res.status(400).json({ error: "Los campos email y tarifaBase son obligatorios." });
    }

    try {
        // Verificar duplicado por email
        const [existente] = await pool.query(
            'SELECT Id_profesional FROM Profesional WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            return res.status(400).json({ error: "El correo electrónico ya se encuentra registrado." });
        }

        const [result] = await pool.query(
            'INSERT INTO Profesional (email, tarifaBase) VALUES (?, ?)',
            [email, parseFloat(tarifaBase)]
        );

        res.status(201).json({
            mensaje: "Profesional registrado exitosamente en MySQL",
            id_profesional: result.insertId,
            email,
            tarifaBase: parseFloat(tarifaBase)
        });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el profesional.", detalle: error.message });
    }
});

module.exports = router;