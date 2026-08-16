const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    id_cliente: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Cliente', clienteSchema);