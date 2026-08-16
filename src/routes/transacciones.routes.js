// src/routes/transacciones.routes.js
const express = require('express');
const router = express.Router();
const { transacciones, solicitudes, servicios } = require('../models/datos');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// POST /api/transacciones/procesar -> +ProcesarPago()
// Ejecutado habitualmente por el CLIENTE para saldar la solicitud
router.post('/procesar', verificarToken, permitirRoles('CLIENTE'), (req, res) => {
    const { id_solicitud, monto } = req.body;

    if (!id_solicitud || !monto) {
        return res.status(400).json({ error: "Campos requeridos: id_solicitud y monto." });
    }

    // 1. Verificar la existencia de la solicitud
    const solicitud = solicitudes.find(
        s => s.id_solicitud === parseInt(id_solicitud) && s.id_cliente === req.usuario.id
    );

    if (!solicitud) {
        return res.status(404).json({ error: "Solicitud no encontrada o no pertenece al cliente autenticado." });
    }

    // 2. Evitar doble pago para una misma solicitud
    const pagoExistente = transacciones.find(
        t => t.id_solicitud === parseInt(id_solicitud) && t.estadoPago === 'COMPLETADO'
    );

    if (pagoExistente) {
        return res.status(400).json({ error: "Esta solicitud ya tiene una transacción completada registrada." });
    }

    // 3. Simular procesamiento del pago
    const nuevaTransaccion = {
        id_transaccion: transacciones.length + 1,
        monto: parseFloat(monto),
        estadoPago: "COMPLETADO",
        id_solicitud: parseInt(id_solicitud),
        fechaTransaccion: new Date()
    };

    transacciones.push(nuevaTransaccion);

    // Opcional: Actualizar el estado de la solicitud a ACEPTADO/PAGADO
    solicitud.estado = "ACEPTADO";

    res.status(201).json({
        mensaje: "Pago procesado exitosamente",
        transaccion: nuevaTransaccion
    });
});

// GET /api/transacciones/solicitud/:id_solicitud -> Consulta de estado de pago por solicitud
router.get('/solicitud/:id_solicitud', verificarToken, (req, res) => {
    const idSolicitud = parseInt(req.params.id_solicitud);
    const transaccion = transacciones.find(t => t.id_solicitud === idSolicitud);

    if (!transaccion) {
        return res.status(404).json({ error: "No existe registro de transacción para esta solicitud." });
    }

    res.json(transaccion);
});

module.exports = router;