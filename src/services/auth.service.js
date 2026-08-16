// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const { clientes, profesionales } = require('../models/datos');

const loginService = (email, password) => {
    // Buscar en la tabla Cliente
    let usuario = clientes.find(c => c.email === email && c.password === password);
    let rol = 'CLIENTE';

    // Si no está en Cliente, buscar en Profesional
    if (!usuario) {
        usuario = profesionales.find(p => p.email === email && p.password === password);
        rol = 'PROFESIONAL';
    }

    if (!usuario) {
        throw new Error("Credenciales inválidas.");
    }

    // Armar el payload según el tipo de usuario
    const payload = {
        id: rol === 'CLIENTE' ? usuario.id_cliente : usuario.id_profesional,
        email: usuario.email,
        nombre: usuario.nombre || usuario.email,
        rol: rol
    };

    const secretKey = process.env.JWT_SECRET || 'secreto_por_defecto';
    const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });

    return {
        mensaje: "Autenticación exitosa",
        rol,
        usuario: payload,
        token: `Bearer ${token}`
    };
};

module.exports = {
    loginService
};