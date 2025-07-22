const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Reading = sequelize.define('Reading', {
    id_lectura: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    flujo_energia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dir_viento: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dir_viento_prom: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    velocidad_viento: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    velocidad_viento_prom: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    energia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    radiacion_solar_prom: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    temp_prom: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
},
    {
        tableName: 'lecturas',
        timestamps: false
    }
);

module.exports = Reading;