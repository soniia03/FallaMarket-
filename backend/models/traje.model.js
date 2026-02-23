const mongoose = require('mongoose');
const {Schema} = require("mongoose");


const trajesSchema = new Schema({
        nombre: {type: String, required: true},
        material: {type: String, required: true},
        propietario: {type: String, required: true},
        descripcion: {type: String, required: true},
        precio: {type: Number, required: true},
        disponible: {type: Boolean, required: true},
    },
    {
        versionKey: false,
        timestamps: true      // agrega createdAt y updatedAt automáticamente
    }
    );

module.exports = mongoose.model('Trajes', trajesSchema, 'trajes2026');