import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema({
    nombre: String,
    fechaInicio: Date,
    fechaFin: Date,
    viewPreference: String,
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
});

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

export default Proyecto;




