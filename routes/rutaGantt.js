const express = require('express');
const router = express.Router();
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

// Ruta para obtener todos los proyectos
router.get('/proyectos', async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        const proyectosFrappeGantt = proyectos.map(proyecto => {
            return {
                id: proyecto._id.toString(),
                name: proyecto.nombre,
                start: proyecto.fechaInicio.toISOString().split('T')[0],
                end: proyecto.fechaFin.toISOString().split('T')[0],
            };
        });
        /* console.log('Proyectos Frappe Gantt:', proyectosFrappeGantt); */
        res.render('index', { proyectosFrappeGantt });
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para obtener un proyecto y sus tareas por ID
router.get('/proyectos/:id', async (req, res) => {
    const proyectoId = req.params.id;
    try {
        const proyecto = await Proyecto.findById(proyectoId);
        if (!proyecto) {
            return res.status(404).send('Proyecto no encontrado');
        }

        const tareas = await Tarea.find({ proyectoId });
        res.render('proyecto', { proyecto, tareas });
    } catch (error) {
        console.error('Error al obtener proyecto y tareas:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para crear un nuevo proyecto
router.post('/proyectos', async (req, res) => {
    const { nombre, fechaInicio, fechaFin } = req.body;
    
    try {
        const nuevoProyecto = new Proyecto({ nombre, fechaInicio, fechaFin });
        await nuevoProyecto.save();
        res.redirect('/gantt/proyectos');
    } catch (error) {
        console.error('Error al crear un nuevo proyecto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para actualizar un proyecto
router.post('/proyectos/actualizar', async (req, res) => {
    const { proyectoId, nuevaFechaInicio, nuevaFechaFin } = req.body;

    try {
        // Aquí deberías realizar la lógica necesaria para actualizar las fechas en tu base de datos
        // Puedes utilizar el ID del proyecto para buscarlo en la base de datos y actualizar las fechas

        // Por ejemplo, suponiendo que el ID está presente en proyectoId
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            proyectoId,
            { $set: { fechaInicio: nuevaFechaInicio, fechaFin: nuevaFechaFin } },
            { new: true } // Para obtener el proyecto actualizado
        );

        // Redirige al usuario a la página index.ejs
        res.redirect('/gantt/proyectos');  // Ajusta la ruta según tu estructura de URL

    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});


module.exports = router;

