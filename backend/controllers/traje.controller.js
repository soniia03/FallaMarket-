const Traje = require('../models/traje.model');
const mongoose = require('mongoose');
const trajeCtrl = {};

//Funciones CRUD

// Obtener todas los trajes FUNCIONA
trajeCtrl.getTrajes = async (req, res) => {
    const trajes = await Traje.find()
        .then((data)=>res.status(200).json({status:data}))
        .catch((err)=>res.status(400).json({status:err}));
};

// Obtener un traje por su ID  FUNCIONA 
trajeCtrl.getTraje = async (req, res) => {
    // Obtener el id de la URL
    const { id } = req.params;

    // Verificar que el id exista
    if (!id) {
        return res.status(400).json({ status: 'El campo id no puede estar vacio' });
    }

    // Validar que sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: 'Traje no encontrado' });
    }

    try {
        const data = await Traje.findById(id);
        if (!data) {
            // no existía ningún documento con ese id
            return res.status(404).json({ status: 'Traje no encontrado' });
        }
        return res.status(200).json({ status: 'Traje encontrado correctamente', data });
    } catch (err) {
        return res.status(400).json({ status: err });
    }
};

// Agregar un nuevo traje   FUNCIONA 
trajeCtrl.addTraje = async (req, res) => {
    const { nombre, material, propietario, descripcion, precio, disponible } = req.body;
    if (!nombre || !material || !propietario || !descripcion || !precio || !disponible) {
        return res.status(400).json({status: 'Faltan campos: nombre, material, propietario, descripcion, precio o disponible'});
    }

    try {
        // Verificar si ya existe un traje con el mismo nombre
        const trajeExistente = await Traje.findOne({ nombre });
        if (trajeExistente) {
            return res.status(400).json({status: 'Ya existe un traje con ese nombre'});
        }

        const traje = new Traje({ nombre, material, propietario, descripcion, precio, disponible });
        const saved = await traje.save();
        // enviamos el documento completo; incluirá createdAt/updatedAt automáticamente
        return res.status(200).json({status: 'Traje agregado correctamente', data: saved});
    } catch (err) {
        return res.status(400).json({status: err});
    }
};

// Actualizar un traje  FUNCIONA 
trajeCtrl.updateTraje = async (req, res) => {
    // Obtener el id de la URL
    const { id } = req.params;

    // Verificar que el id exista
    if (!id) {
        return res.status(400).json({ status: 'El campo _id no puede estar vacio' });
    }

    // Validar que sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: 'Traje no encontrado' });
    }

    // Desestructuramos los campos esperados en el body
    const { nombre, material, propietario } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!nombre || !material || !propietario) {
        return res.status(400).json({ status: 'Faltan campos: nombre, material o propietario' });
    }

    const update = { nombre, material, propietario, updatedAt: Date.now() };
    try {
        const data = await Traje.findByIdAndUpdate(id, update, { new: true });
        if (!data) {
            // no existía ningún documento con ese id
            return res.status(404).json({ status: 'Traje no encontrado' });
        }
        return res.status(200).json({ status: 'Traje actualizado correctamente', data });
    } catch (err) {
        return res.status(400).json({ status: err });
    }
};

// Eliminar un traje FUNCIONA
trajeCtrl.deleteTraje = async (req, res) => {
    // Obtener el id de la URL
    const { id } = req.params;

    // Verificar que el id exista
    if (!id) {
        return res.status(400).json({ status: 'El campo id no puede estar vacio' });
    }

    // Validar que sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ status: 'Traje no encontrado' });
    }

    try {
        const data = await Traje.findByIdAndDelete(id);
        if (!data) {
            // no existía ningún documento con ese id
            return res.status(404).json({ status: 'Traje no encontrado' });
        }
        return res.status(200).json({ status: 'Traje eliminado correctamente' });
    } catch (err) {
        return res.status(400).json({ status: err });
    }
};

module.exports = trajeCtrl;