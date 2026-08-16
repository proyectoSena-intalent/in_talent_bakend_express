// src/models/datos.js

// Entidad: Cliente
const clientes = [
    { id_cliente: 1, nombre: "Edwyn Robles", email: "edwynro89@gmail.com", password: "123" }
];

// Entidad: Profesional
const profesionales = [
    { id_profesional: 1, email: "mario.plomero@gmail.com", password: "123", tarifaBase: 40000.0 }
];

// Entidad: Categoria
const categorias = [
    { id_categoria: 1, nombre: "Plomería" },
    { id_categoria: 2, nombre: "Electricidad" },
    { id_categoria: 3, nombre: "Paseo de mascotas" }
];

// Entidad: Servicio (Relacionado con Categoria y Profesional)
const servicios = [
    {
        id_servicio: 1,
        descripcion: "Instalación de grifería y tuberías en cocina",
        tarifaPromedio: 50000.0,
        id_categoria: 1,
        id_profesional: 1
    }
];

// Entidad: Solicitud (Relacionado con Cliente, Profesional y Servicio)
const solicitudes = [
    {
        id_solicitud: 1,
        estado: "PENDIENTE",
        FechaCreacion: new Date(),
        id_cliente: 1,
        id_profesional: 1,
        id_servicio: 1
    }
];

// Entidad: Calificacion
const calificaciones = [
    {
        id_calificacion: 1,
        puntuacion: 5,
        comentario: "Excelente servicio, muy puntual y profesional.",
        id_solicitud: 1,
        id_cliente: 1,
        fecha: new Date()
    }
];
// Agregar dentro de src/models/datos.js

// Entidad: Mensaje
const mensajes = [
    {
        id_mensaje: 1,
        contenido: "Hola, ¿podrías darme más detalles del horario para la reparación?",
        fechaHora: new Date(),
        leido: false,
        id_solicitud: 1,
        id_emisor: 1,        
        rol_emisor: "CLIENTE" 
    }
];

// Entidad: Transaccion
const transacciones = [
    {
        id_transaccion: 1,
        monto: 50000.0,
        estadoPago: "COMPLETADO", // 'PENDIENTE', 'COMPLETADO', 'FALLIDO'
        id_solicitud: 1,
        fechaTransaccion: new Date()
    }
];

module.exports = {
    clientes,
    profesionales,
    categorias,
    servicios,
    solicitudes,
    calificaciones,
    mensajes,
    transacciones
};