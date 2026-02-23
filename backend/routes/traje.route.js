const express = require('express');
const  trajeCtrl = require('../controllers/traje.controller');
const router = express.Router();


router.get('/', trajeCtrl.getTrajes);
router.get('/traje/:id', trajeCtrl.getTraje);
router.post('/anadir', trajeCtrl.addTraje);
router.put('/editar/:id', trajeCtrl.updateTraje);
router.delete('/eliminar/:id', trajeCtrl.deleteTraje);

module.exports = router;