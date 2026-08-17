// src/services/auth.service.js
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_in_talent_2026';

const loginUsuario = async (email) => {
    // 1. Buscar en la tabla Cliente
    const [clientes] = await pool.query(
        'SELECT Id_cliente AS id, nombre, email FROM Cliente WHERE email = ?', 
        [email]
    );

    if (clientes.length > 0) {
        const cliente = clientes[0];
        const token = jwt.sign(
            { id: cliente.id, email: cliente.email, rol: 'CLIENTE' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        return {
            token,
            usuario: { id: cliente.id, nombre: cliente.nombre, email: cliente.email, rol: 'CLIENTE' }
        };
    }

    // 2. Si no es cliente, buscar en la tabla Profesional
    const [profesionales] = await pool.query(
        'SELECT Id_profesional AS id, email, tarifaBase FROM Profesional WHERE email = ?', 
        [email]
    );

    if (profesionales.length > 0) {
        const profesional = profesionales[0];
        const token = jwt.sign(
            { id: profesional.id, email: profesional.email, rol: 'PROFESIONAL' },
            JWT_SECRET,
            { expiresIn: '8h' }
        );
        return {
            token,
            usuario: { id: profesional.id, email: profesional.email, tarifaBase: profesional.tarifaBase, rol: 'PROFESIONAL' }
        };
    }

    // 3. No encontrado en ninguna tabla
    throw new Error('Credenciales inválidas: usuario no encontrado.');
};

module.exports = { loginUsuario };