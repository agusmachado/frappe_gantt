import express from 'express';

import{
    obtenerProyectos,
    crearProyectoNuevo,
    actualizarProyecto,
    cambiarVista,
    actualizarCumplimiento,    
} from '../controllers/ganttController.js'

const router = express.Router();


// ------------------------------ Ruta para obtener todos los proyectos

router.get('/', obtenerProyectos);


// ------------------------ Ruta para crear un nuevo proyecto

router.post('/proyectos', crearProyectoNuevo);


// ----------------------- Ruta para actualizar un proyecto

router.post('/proyectos/actualizar', actualizarProyecto);


// ----------------------------- Ruta para cambiar la preferencia de vista de un proyecto

router.post('/proyectos/cambiar-vista', cambiarVista);


// ------------------------------ Actualizar cumplimiento

router.post('/actualizar-cumplimiento', actualizarCumplimiento);


  


export default router



