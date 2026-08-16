const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema({
    id_solicitud: { type: Number, required: true, unique: true },
    estado: { type: String, enum: ['PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'CERRADO'], default: 'PENDIENTE' },
    FechaCreacion: { type: Date, default: Date.now },
    id_cliente: { type: Number, required: true },
    id_profesional: { type: Number, required: true },
    id_servicio: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', solicitudSchema);