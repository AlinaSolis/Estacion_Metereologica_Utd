const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Sensor = sequelize.define('Sensor', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  parametros: {
    type: DataTypes.STRING
  },
  precision_sensor: {
    type: DataTypes.STRING
  },
  voltaje: {
    type: DataTypes.STRING
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastReading: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'sensores',
  timestamps: false
});

module.exports = Sensor;
