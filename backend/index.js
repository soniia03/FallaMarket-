// console.log("Hola desde el backend");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const {mongoose} = require('./database');
const {json} = require('express');

//Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/v1/trajes', require('./routes/traje.route'));
app.use('/', (req, res) => res.send('API is in /api/v1/trajes/'));



//Settings
app.set('port', process.env.PORT || 3000);
//iniciar el server
app.listen(app.get('port'),() =>{
    console.log('Server on port', app.get('port'));
})