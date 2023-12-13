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
                viewPreference: proyecto.viewPreference || 'Month', // Nuevo campo para la preferencia de vista
            };
        });

        // Define la variable proyecto (puedes ajustar la lógica según tus necesidades)
        const proyecto = proyectosFrappeGantt.length > 0 ? proyectosFrappeGantt[0] : null;

        res.render('index', { proyectosFrappeGantt, proyecto });
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// Ruta para cambiar la vista del proyecto
router.post('/proyectos/cambiar-vista', async (req, res) => {
    const { proyectoId, nuevaVista } = req.body;

    try {
        // Actualiza la preferencia de vista en todos los proyectos
        await Proyecto.updateMany({}, { $set: { viewPreference: nuevaVista } });

        // Obtén la información actualizada de todos los proyectos después de guardar los cambios
        const nuevaInformacion = await Proyecto.find();

        // Envía una respuesta JSON con la nueva información
        res.json({ success: true, nuevaInformacion });

    } catch (error) {
        console.error('Error al cambiar la vista en el servidor:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
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
        // Actualizar el campo de preferencia de vista en el modelo de proyecto
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
