const Traje = require('../models/traje.model');
const mongoose = require('mongoose');
const trajeCtrl = {};

//Funciones CRUD

// Obtener todas los trajes con paginación FUNCIONA
trajeCtrl.getTrajes = async (req, res) => {
    try {
        // Obtener parámetros de paginación de la query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        // Calcular el skip
        const skip = (page - 1) * limit;
        
        // Obtener el total de documentos
        const total = await Traje.countDocuments();
        
        // Obtener los trajes con paginación
        const trajes = await Traje.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Ordenar por más recientes primero
        
        // Calcular información de paginación
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        return res.status(200).json({
            status: trajes,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (err) {
        console.error('Error al obtener trajes:', err);
        return res.status(400).json({ 
            status: 'Error al obtener los trajes',
            message: err.message || 'Error desconocido'
        });
    }
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
        console.error('Error al obtener traje:', err);
        return res.status(400).json({ 
            status: 'Error al obtener el traje',
            message: err.message || 'Error desconocido'
        });
    }
};

// Agregar un nuevo traje   FUNCIONA 
trajeCtrl.addTraje = async (req, res) => {
    const { nombre, material, propietario, descripcion, precio, disponible } = req.body;
    if (!nombre || !material || !propietario || !descripcion || precio === undefined || disponible === undefined) {
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
        console.error('Error al agregar traje:', err);
        return res.status(400).json({ 
            status: 'Error al agregar el traje',
            message: err.message || 'Error desconocido'
        });
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
    const { nombre, material, propietario, descripcion, precio, disponible } = req.body;

    // Verificar que los campos requeridos estén presentes
    if (!nombre || !material || !propietario || !descripcion || precio === undefined || disponible === undefined) {
        return res.status(400).json({ status: 'Faltan campos: nombre, material, propietario, descripcion, precio o disponible' });
    }

    const update = { nombre, material, propietario, descripcion, precio, disponible, updatedAt: Date.now() };
    try {
        const data = await Traje.findByIdAndUpdate(id, update, { new: true });
        if (!data) {
            // no existía ningún documento con ese id
            return res.status(404).json({ status: 'Traje no encontrado' });
        }
        return res.status(200).json({ status: 'Traje actualizado correctamente', data });
    } catch (err) {
        console.error('Error al actualizar traje:', err);
        return res.status(400).json({ 
            status: 'Error al actualizar el traje',
            message: err.message || 'Error desconocido'
        });
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
        console.error('Error al eliminar traje:', err);
        return res.status(400).json({ 
            status: 'Error al eliminar el traje',
            message: err.message || 'Error desconocido'
        });
    }
};

module.exports = trajeCtrl;