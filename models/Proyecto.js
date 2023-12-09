// Proyecto.js
const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: String,
    fechaInicio: Date,
    fechaFin: Date
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;
