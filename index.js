const express = require('express');
const mongoose = require('mongoose');
const rutaGantt = require('./routes/rutaGantt.js');
const Proyecto = require('./models/Proyecto.js');
const Tarea = require('./models/Tarea.js');
require('dotenv').config();
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.once('open', () => {
    console.log('Conexión a la base de datos establecida con éxito');
});

mongoose.connection.on('error', (error) => {
    console.error('Error en la conexión a la base de datos:', error);
});

app.use('/gantt', rutaGantt);

const PORT = process.env.PORT || 3000;
const host = process.env.HOST;

app.listen(PORT, host, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
