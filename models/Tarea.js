import mongoose from 'mongoose';

const tareaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    proyectoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto',  // Referencia al modelo de Proyecto
        required: true
    }
});

const Tarea = mongoose.model('Tarea', tareaSchema);

export default Tarea;
