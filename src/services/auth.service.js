// src/services/auth.service.js
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_in_talent_2026';

const loginUsuario = async (email) => {
    // 1. Buscar en la tabla cliente (en minúsculas)
    const [clientes] = await pool.query(
        'SELECT Id_cliente AS id, nombre, email FROM cliente WHERE email = ?', 
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

    // 2. Buscar en la tabla profesional (en minúsculas)
    const [profesionales] = await pool.query(
        'SELECT Id_profesional AS id, email, tarifaBase FROM profesional WHERE email = ?', 
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

    throw new Error('Credenciales inválidas: usuario no encontrado.');
};

const registrarUsuario = async (datos) => {
    const { nombre, email, telefono, contrasena } = datos;

    // Validar existencia usando tablas en minúsculas
    const [clientes] = await pool.query('SELECT email FROM cliente WHERE email = ?', [email]);
    const [profesionales] = await pool.query('SELECT email FROM profesional WHERE email = ?', [email]);

    if (clientes.length > 0 || profesionales.length > 0) {
        throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    // Insertar en la tabla cliente
    const [resultado] = await pool.query(
        'INSERT INTO cliente (nombre, email, telefono, contrasena) VALUES (?, ?, ?, ?)',
        [nombre, email, telefono || null, contrasena]
    );

    const newId = resultado.insertId;
    const token = jwt.sign(
        { id: newId, email, rol: 'CLIENTE' },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    return {
        token,
        usuario: { id: newId, nombre, email, telefono, rol: 'CLIENTE' }
    };
};

module.exports = { loginUsuario, registrarUsuario };