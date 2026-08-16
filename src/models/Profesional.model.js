const mongoose = require('mongoose');

const profesionalSchema = new mongoose.Schema({
    id_profesional: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tarifaBase: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Profesional', profesionalSchema);