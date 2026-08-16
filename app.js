// app.js
require('dotenv').config();
const express = require('express');
const pool = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Probar conexión a MySQL
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL (in_talent_db)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error de conexión a MySQL:', err.message);
    });

const authRoutes = require('./src/routes/auth.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');
const serviciosRoutes = require('./src/routes/servicios.routes');
const solicitudesRoutes = require('./src/routes/solicitudes.routes');
const calificacionesRoutes = require('./src/routes/calificaciones.routes');
const mensajesRoutes = require('./src/routes/mensajes.routes');
const transaccionesRoutes = require('./src/routes/transacciones.routes');


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/calificaciones', calificacionesRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/transacciones', transaccionesRoutes);

app.listen(PORT, () => {
    console.log(`Servidor InTalent corriendo en http://localhost:${PORT}`);
});