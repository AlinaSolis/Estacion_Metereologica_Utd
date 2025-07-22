const Sensor = require('../models/Sensor');

const getAllSensors = async () => {
  const sensores = await Sensor.findAll();

  //agrega tipo a cada sensor
  return sensores.map(sensor => {
    const sensorData = sensor.toJSON();
    sensorData.type = getTypeFromSensor(sensorData);
    return sensorData;
  });
};

//esto es para determinar el tipo segun el sensor
const getTypeFromSensor = (sensor) => {
  const nombre = sensor.nombre.toLowerCase();
  if (nombre.includes('temperatura')) return 'temperature';
  if (nombre.includes('viento')) return 'wind';
  if (nombre.includes('solar')) return 'solar';
  return 'default';
};

const createSensor = async (sensorData) => {
  return await Sensor.create(sensorData);
};

const updateSensor = async (id, updatedData) => {
  return await Sensor.update(updatedData, {
    where: { id }
  });
};

const deleteSensor = async (id) => {
  return await Sensor.destroy({ where: { id } });
};

const getSensorById = async (id) => {
  return await Sensor.findByPk(id);
};


module.exports = {
  getAllSensors,
  getTypeFromSensor,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorById
};
