// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar configuración de la base de datos
const pool = require('./src/config/db');

// Importar rutas de la API
const authRoutes = require('./src/routes/auth.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const categoriasRoutes = require('./src/routes/categorias.routes');
const serviciosRoutes = require('./src/routes/servicios.routes');
const solicitudesRoutes = require('./src/routes/solicitudes.routes');
const transaccionesRoutes = require('./src/routes/transacciones.routes');
const mensajesRoutes = require('./src/routes/mensajes.routes');
const calificacionesRoutes = require('./src/routes/calificaciones.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Verificación inicial de conexión a MySQL
pool.getConnection()
    .then((connection) => {
        console.log(`✅ Conexión exitosa a la base de datos MySQL (${process.env.DB_NAME || 'in_talent_db'})`);
        connection.release();
    })
    .catch((error) => {
        console.error('❌ Error de conexión a MySQL:', error.message);
    });

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/calificaciones', calificacionesRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: "Servidor Backend de InTalent corriendo correctamente con MySQL" });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada." });
});

// Inicialización del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor InTalent corriendo en http://localhost:${PORT}`);
});

module.exports = app;