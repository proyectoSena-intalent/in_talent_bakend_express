// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller'); // Se ajustó a auth.controller

router.post('/login', login);

module.exports = router;