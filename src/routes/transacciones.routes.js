// src/routes/transacciones.routes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// POST /api/transacciones/procesar -> Registrar un pago (+ProcesarPago)
router.post('/procesar', verificarToken, permitirRoles('CLIENTE'), async (req, res) => {
    const { id_solicitud, monto } = req.body;

    if (!id_solicitud || !monto) {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y monto." });
    }

    try {
        // 1. Verificar la existencia de la solicitud y que pertenezca al cliente autenticado
        const [solicitudes] = await pool.query(
            'SELECT * FROM Solicitud WHERE Id_solicitud = ? AND Id_cliente = ?',
            [id_solicitud, req.usuario.id]
        );

        if (solicitudes.length === 0) {
            return res.status(404).json({ 
                error: "Solicitud no encontrada o no pertenece al cliente autenticado." 
            });
        }

        // 2. Verificar que no exista un pago previamente completado para esta solicitud
        const [pagosExistentes] = await pool.query(
            'SELECT * FROM Transaccion WHERE Id_solicitud = ? AND estadoPago = "COMPLETADO"',
            [id_solicitud]
        );

        if (pagosExistentes.length > 0) {
            return res.status(400).json({ 
                error: "Esta solicitud ya registra un pago completado." 
            });
        }

        // 3. Registrar la transacción en MySQL
        const [result] = await pool.query(
            'INSERT INTO Transaccion (monto, estadoPago, Id_solicitud) VALUES (?, "COMPLETADO", ?)',
            [parseFloat(monto), id_solicitud]
        );

        // 4. Actualizar el estado de la solicitud a 'ACEPTADO'
        await pool.query(
            'UPDATE Solicitud SET estado = "ACEPTADO" WHERE Id_solicitud = ?',
            [id_solicitud]
        );

        res.status(201).json({
            mensaje: "Pago procesado y registrado exitosamente en MySQL",
            id_transaccion: result.insertId,
            monto: parseFloat(monto),
            estadoPago: "COMPLETADO",
            id_solicitud: parseInt(id_solicitud)
        });

    } catch (error) {
        res.status(500).json({ error: "Error al procesar la transacción.", detalle: error.message });
    }
});

// GET /api/transacciones/solicitud/:id_solicitud -> Consultar estado de pago por solicitud
router.get('/solicitud/:id_solicitud', verificarToken, async (req, res) => {
    const { id_solicitud } = req.params;

    try {
        const [transacciones] = await pool.query(
            'SELECT * FROM Transaccion WHERE Id_solicitud = ?',
            [id_solicitud]
        );

        if (transacciones.length === 0) {
            return res.status(404).json({ 
                error: "No existe registro de transacción para la solicitud indicada." 
            });
        }

        res.json(transacciones[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la transacción.", detalle: error.message });
    }
});

module.exports = router;