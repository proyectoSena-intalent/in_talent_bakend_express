// src/routes/servicios.routes.js
const express = require('express');
const router = express.Router();
const { servicios, categorias } = require('../models/datos');
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

// GET /api/servicios -> + MostrarDetalles()
router.get('/', (req, res) => {
    // Retornar lista de servicios enriquecida con la categoría
    const detalleServicios = servicios.map(s => {
        const cat = categorias.find(c => c.id_categoria === s.id_categoria);
        return {
            ...s,
            categoriaNombre: cat ? cat.nombre : 'Sin Categoría'
        };
    });
    res.json(detalleServicios);
});

// POST /api/servicios -> Crear Servicio (Exclusivo de Profesional)
router.post('/', verificarToken, permitirRoles('PROFESIONAL'), (req, res) => {
    const { descripcion, tarifaPromedio, id_categoria } = req.body;

    if (!descripcion || !tarifaPromedio || !id_categoria) {
        return res.status(400).json({ error: "Campos requeridos: descripcion, tarifaPromedio, id_categoria" });
    }

    const nuevoServicio = {
        id_servicio: servicios.length + 1,
        descripcion,
        tarifaPromedio: parseFloat(tarifaPromedio),
        id_categoria: parseInt(id_categoria),
        id_profesional: req.usuario.id // id_profesional extraído del token JWT
    };

    servicios.push(nuevoServicio);

    res.status(201).json({
        mensaje: "Servicio creado correctamente",
        servicio: nuevoServicio
    });
});

module.exports = router;