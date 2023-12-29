// Importa la biblioteca 'mongoose' para interactuar con MongoDB
import mongoose from 'mongoose';

// Define un esquema (schema) para los documentos de la colección 'proyectos' en MongoDB
const proyectoSchema = new mongoose.Schema({
    // Campo 'nombre' de tipo String para almacenar el nombre del proyecto
    nombre: String,

    // Campos 'fechaInicio' y 'fechaFin' de tipo Date para almacenar las fechas de inicio y fin del proyecto
    fechaInicio: Date,
    fechaFin: Date,

    // Campo 'viewPreference' de tipo String para almacenar las preferencias de visualización del proyecto
    viewPreference: String,

    // Campo 'progress' de tipo Number con restricciones (min: 0, max: 100, default: 0)
    // para almacenar el progreso del proyecto, con un valor por defecto de 0
    progress: {
        type: Number,   // Tipo de dato Number
        min: 0,         // Valor mínimo permitido es 0
        max: 100,       // Valor máximo permitido es 100
        default: 0,     // Valor por defecto es 0
    },
});

// Crea un modelo (model) de MongoDB llamado 'Proyecto' basado en el esquema definido
const Proyecto = mongoose.model('Proyecto', proyectoSchema);

// Exporta el modelo 'Proyecto' para que pueda ser utilizado en otros archivos
export default Proyecto;



