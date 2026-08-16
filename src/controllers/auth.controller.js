// src/controllers/auth.controller.js
const authServices = require('../services/auth.service'); // Se ajustó a auth.service

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Debes proporcionar email y contraseña' });
  }

  try {
    const resultado = await authServices.loginService(email, password);
    return res.json(resultado);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  login
};