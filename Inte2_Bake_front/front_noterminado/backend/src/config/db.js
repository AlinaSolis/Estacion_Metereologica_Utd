const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
         // ← ESTA LÍNEA ERA LA QUE FALTABA
        dialect: 'mysql',
        logging: false,
        define: {
            timestamps: false,
        },
    }
);

async function connectDB(){
    try {
        await sequelize.authenticate();
        console.log("Conectado a la DB de MariaDB/MySQL");
        await sequelize.sync();
    } catch (err){
        console.error("Error al conectar con MariaDB/MySQL: ", err);
        process.exit(1);
    }
}

module.exports = { sequelize, connectDB };