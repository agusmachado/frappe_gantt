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

// Puedes agregar más rutas y lógica según sea necesario...

module.exports = router;

