const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Faltan credenciales' });

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(409).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Faltan credenciales' });

  if (username !== 'admin' || password !== 'admin123') {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
  try {
    /*
    const user = await User.findOne({ where: { username } });
    if (!user)
      return res.status(401).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Contraseña incorrecta' });
*/
    //generacion de JWT
    const token = jwt.sign(
      { id: '1234', username: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { login, register };
