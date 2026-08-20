const express = require('express');
const router = express.Router();

// Importamos los métodos del controlador por desestructuración
const { login, registro } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/registro', registro);
router.post('/register', registro); // Usamos la misma función 'registro'

module.exports = router;