import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import rutaGantt from './routes/rutaGantt.js'

dotenv.config();
const app = express();

// ---- HABILITAMOS LAS VARIABLES DE ENTORNO ---- //
const PORT = process.env.PORT || 3000;
const host = process.env.HOST;

// ---- CONEXIÓN BASE DE DATOS ---- //
conectarDB();


// ---- ARCHIVOS ESTÁTICOS Y ACTIVACIÓN DE LOS EJS ---- //
app.use(express.static('public'));
app.set('view engine', 'ejs');

// ---- MIDDLEWARE PARA PROCESAR LOS DATOS DEL FORMULARIO ---- //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---- RUTAS PARA EL PROYECTO GANTT ---- //
app.use('/', rutaGantt);


app.listen(PORT, host, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
