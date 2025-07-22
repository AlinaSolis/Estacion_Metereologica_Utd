const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authMiddleware = require('../middlewares/authMiddleware');

//rutas protegidas para los sensores
router.get('/', authMiddleware, sensorController.getAllSensors);
router.post('/', authMiddleware, sensorController.createSensor);
router.put('/:id', authMiddleware, sensorController.updateSensor);
router.delete('/:id', authMiddleware, sensorController.deleteSensor);
router.put('/:id/toggle', authMiddleware, sensorController.toggleSensor);

module.exports = router;
