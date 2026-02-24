// Backend API para FallaMarket
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const {mongoose} = require('./database');
const {json} = require('express');

//Middlewares
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

//Routes
app.use('/api/v1/trajes', require('./routes/traje.route'));
app.use('/', (req, res) => res.send('API is in /api/v1/trajes/'));

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ 
        status: 'Error interno del servidor',
        message: err.message || 'Error desconocido'
    });
});

// Manejador de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ status: 'Ruta no encontrada' });
});

//Settings
app.set('port', process.env.PORT || 3000);

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(app.get('port'),() =>{
        console.log('Server on port', app.get('port'));
    });
}

// Para Vercel
module.exports = app;