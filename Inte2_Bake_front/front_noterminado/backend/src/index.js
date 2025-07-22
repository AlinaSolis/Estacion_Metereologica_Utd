require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); //para mejorar la seguridad 
const { connectDB } = require('../src/config/db');
const readingRt = require('../src/routes/readingRoutes');
const authRt = require('../src/routes/authRoutes');

const app = express();

app.use(helmet());

//middlewares
app.use(cors());
app.use(express.json());

//conexión a base de datos
connectDB();

//rutas
app.use('/api/readings', readingRt);
app.use('/api/auth', authRt);

const userRoutes = require('../src/routes/userRoutes');
app.use('/api/users', userRoutes);

const sensorRoutes = require('../src/routes/sensorRoutes');
app.use('/api/sensores', sensorRoutes);

//manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

//servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`El server está corriendo en el puerto ${PORT}`);
});