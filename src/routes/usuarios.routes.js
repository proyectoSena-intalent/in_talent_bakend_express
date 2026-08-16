const express = require('express');
const router = express.Router();
const { verificarToken, permitirRoles } = require('../middlewares/auth.middleware');

router.get('/perfil', verificarToken, (req, res) => {
    res.json({
        mensaje: "Perfil obtenido con éxito",
        usuario: req.usuario
    });
});

module.exports = router; // <-- IMPORTANTE