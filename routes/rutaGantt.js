import express from 'express';
import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';

const router = express.Router();
// ------------------------------ Ruta para obtener todos los proyectos

router.get('/', async (req, res) => {
    try {
        // Consulta todos los proyectos en la base de datos
        const proyectos = await Proyecto.find();

        // Mapea los proyectos obtenidos a un formato compatible con Frappe Gantt
        const proyectosFrappeGantt = proyectos.map(proyecto => {
            return {
                id: proyecto._id.toString(), // Convierte el ID a cadena para evitar problemas de tipo
                name: proyecto.nombre,
                start: proyecto.fechaInicio.toISOString().split('T')[0], // Convierte la fecha de inicio a formato ISO
                end: proyecto.fechaFin.toISOString().split('T')[0], // Convierte la fecha de fin a formato ISO
                viewPreference: proyecto.viewPreference || 'Month', // Nuevo campo para la preferencia de vista
            };
        });

        // Define la variable 'proyecto' para pasarla a la plantilla (puedes ajustar la lógica según tus necesidades)
        const proyecto = proyectosFrappeGantt.length > 0 ? proyectosFrappeGantt[0] : null;

        // Renderiza la plantilla 'index' y pasa los datos de los proyectos y el proyecto seleccionado
        res.render('index', { proyectosFrappeGantt, proyecto });
    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta de error al cliente
        console.error('Error al obtener proyectos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// ----------------- Ruta para obtener un proyecto y sus tareas por ID

router.get('/proyectos/:id', async (req, res) => {
    // Obtiene el ID del proyecto de los parámetros de la URL
    const proyectoId = req.params.id;

    try {
        // Busca el proyecto por su ID en la base de datos
        const proyecto = await Proyecto.findById(proyectoId);

        // Verifica si el proyecto existe
        if (!proyecto) {
            // Si no existe, envía una respuesta con código 404 y un mensaje de error
            return res.status(404).send('Proyecto no encontrado');
        }

        // Busca las tareas asociadas al proyecto en la base de datos
        const tareas = await Tarea.find({ proyectoId });

        // Renderiza la plantilla 'proyecto' con los datos del proyecto y sus tareas
        res.render('proyecto', { proyecto, tareas });

    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta de error al cliente
        console.error('Error al obtener proyecto y tareas:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// ------------------------ Ruta para crear un nuevo proyecto

router.post('/proyectos', async (req, res) => {
    // Obtiene los datos del cuerpo de la solicitud (nombre, fechaInicio, fechaFin)
    const { nombre, fechaInicio, fechaFin } = req.body;
    
    try {
        // Crea un nuevo objeto Proyecto con los datos proporcionados
        const nuevoProyecto = new Proyecto({ nombre, fechaInicio, fechaFin });

        // Guarda el nuevo proyecto en la base de datos
        await nuevoProyecto.save();

        // Redirige al usuario a la página principal después de crear el proyecto
        res.redirect('/');

    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta de error al cliente
        console.error('Error al crear un nuevo proyecto:', error);
        res.status(500).send('Error interno del servidor');
    }
});


// ----------------------- Ruta para actualizar un proyecto
router.post('/proyectos/actualizar', async (req, res) => {
    // Obtiene los datos necesarios del cuerpo de la solicitud (proyectoId, nuevaFechaInicio, nuevaFechaFin)
    const { proyectoId, nuevaFechaInicio, nuevaFechaFin } = req.body;

    try {
        // Actualiza el proyecto en la base de datos usando el método findByIdAndUpdate
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            proyectoId,
            { $set: { fechaInicio: nuevaFechaInicio, fechaFin: nuevaFechaFin } },
            { new: true } // Para obtener el proyecto actualizado
        );

        // Redirige al usuario a la página principal después de actualizar el proyecto
        res.redirect('/');  // Ajusta la ruta según tu estructura de URL

    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta JSON de error al cliente
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});


// ----------------------------- Ruta para cambiar la preferencia de vista de un proyecto
router.post('/proyectos/cambiar-vista', async (req, res) => {
    // Obtiene el proyectoId y nuevaVista desde el cuerpo de la solicitud (req.body)
    const { proyectoId, nuevaVista } = req.body;

    try {
        // Encuentra el proyecto por su ID en la base de datos
        const proyecto = await Proyecto.findById(proyectoId);

        // Verifica si el proyecto existe
        if (!proyecto) {
            // Si no existe, envía una respuesta JSON con un mensaje de error y código 404
            return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
        }

        // Actualiza la preferencia de vista en el proyecto con el valor proporcionado
        proyecto.viewPreference = nuevaVista;

        // Guarda los cambios en la base de datos
        await proyecto.save();

        // Obtiene la información actualizada de todos los proyectos después de guardar los cambios
        const nuevosProyectos = await Proyecto.find();

        // Envía una respuesta JSON exitosa con la nueva información de los proyectos
        res.json({ success: true, nuevosProyectos });

    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta JSON de error al cliente
        console.error('Error al cambiar la vista en el servidor:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});


export default router
