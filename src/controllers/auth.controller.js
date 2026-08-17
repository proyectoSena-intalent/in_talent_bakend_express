// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

const login = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "El correo electrónico es obligatorio." });
    }

    try {
        const resultado = await authService.loginUsuario(email);
        return res.json(resultado);
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

module.exports = { login };