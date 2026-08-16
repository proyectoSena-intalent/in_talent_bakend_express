const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
    id_servicio: { type: Number, required: true, unique: true },
    descripcion: { type: String, required: true },
    tarifaPromedio: { type: Number, required: true },
    id_categoria: { type: Number, required: true },
    id_profesional: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Servicio', servicioSchema);