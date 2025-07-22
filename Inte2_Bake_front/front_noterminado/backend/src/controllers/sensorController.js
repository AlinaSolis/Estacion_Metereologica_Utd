const sensorService = require('../services/sensorService');

const getAllSensors = async (req, res) => {
  try {
    const sensores = await sensorService.getAllSensors();
    res.json(sensores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sensores', error });
  }
};

const createSensor = async (req, res) => {
  try {
    const newSensor = await sensorService.createSensor(req.body);
    res.status(201).json(newSensor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear sensor', error });
  }
};

const updateSensor = async (req, res) => {
  try {
    const { id } = req.params;
    await sensorService.updateSensor(id, req.body);
    res.json({ message: 'Sensor actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar sensor', error });
  }
};

const deleteSensor = async (req, res) => {
  try {
    const { id } = req.params;
    await sensorService.deleteSensor(id);
    res.json({ message: 'Sensor eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sensor', error });
  }
};

const toggleSensor = async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await sensorService.getSensorById(id);
    if (!sensor) return res.status(404).json({ message: 'Sensor no encontrado' });

    //toggle de activo
    sensor.activo = !sensor.activo;
    await sensor.save();

    //agregar el tipo
    const sensorJSON = sensor.toJSON();
    sensorJSON.type = sensorService.getTypeFromSensor(sensorJSON);

    res.json(sensorJSON);
  } catch (error) {
    console.error('Error toggleSensor:', error);
    res.status(500).json({ message: 'Error al alternar sensor', error });
  }
};

module.exports = {
  getAllSensors,
  createSensor,
  updateSensor,
  deleteSensor,
  toggleSensor
};
