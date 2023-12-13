const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    nombre: String,
    fechaInicio: Date,
    fechaFin: Date,
    viewPreference: String  // Agrega este campo para almacenar la preferencia de vista
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;


