import express from 'express';
import Proyecto from '../models/Proyecto.js';

import{
    obtenerProyectos,
   // obtenerProyectosPorId,
    crearProyectoNuevo,
    actualizarProyecto,
    cambiarVista,    
} from '../controllers/ganttController.js'

const router = express.Router();


// ------------------------------ Ruta para obtener todos los proyectos

router.get('/', obtenerProyectos);

// ----------------- Ruta para obtener un proyecto y sus tareas por ID

//router.get('/proyectos/:id', obtenerProyectosPorId);



// ------------------------ Ruta para crear un nuevo proyecto

router.post('/proyectos', crearProyectoNuevo);


// ----------------------- Ruta para actualizar un proyecto

router.post('/proyectos/actualizar', actualizarProyecto);


// ----------------------------- Ruta para cambiar la preferencia de vista de un proyecto

router.post('/proyectos/cambiar-vista', cambiarVista);


// ------------------------------ Actualizar cumplimiento

router.post('/actualizar-cumplimiento', async (req, res) => {
    try {
        // Obtiene los datos necesarios del cuerpo de la solicitud (proyectoId, progress)
        const { proyectoId, progress } = req.body;

        // Verifica que proyectoId y progress estén presentes y sean cadenas no vacías
        if (!proyectoId || !progress || typeof proyectoId !== 'string' || typeof progress !== 'string') {
            return res.status(400).json({ success: false, error: 'Datos de solicitud inválidos' });
        }

        // Convierte progress a un número y verifica si es un número válido
        const progressNumber = Number(progress);
        if (isNaN(progressNumber) || progressNumber < 0 || progressNumber > 100) {
            return res.status(400).json({ success: false, error: 'El valor de avance no es válido' });
        }

        // Busca el proyecto por ID y actualiza el campo de cumplimiento en la base de datos
        const proyecto = await Proyecto.findByIdAndUpdate(
            proyectoId,
            { $set: { progress: progressNumber } },
            { new: true }
        );

        // Verifica si el proyecto existe
        if (!proyecto) {
            return res.status(404).json({ success: false, error: 'Proyecto no encontrado' });
        }

        // Envía una respuesta JSON con el proyecto actualizado
        res.json({ success: true, proyecto: { ...proyecto.toJSON(), progress: proyecto.progress } });
    } catch (error) {
        // Manejo de errores: Loggea el error y envía una respuesta JSON de error al cliente
        console.error('Error al actualizar el cumplimiento:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});


  


export default router



