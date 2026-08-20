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

const registro = async (req, res) => {
    // ESTA LÍNEA NOS MOSTRARÁ SI LLEGA LA PETICIÓN DESDE ANDROID
    console.log("--> Petición de registro recibida con Body:", req.body);

    try {
        const datosUsuario = req.body;
        const nuevoUsuario = await authService.registrarUsuario(datosUsuario);
        return res.status(201).json({ 
            mensaje: "Usuario registrado con éxito", 
            data: nuevoUsuario 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = { login, registro };