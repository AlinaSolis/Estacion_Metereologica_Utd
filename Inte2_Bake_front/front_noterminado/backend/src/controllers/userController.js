const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//enlistar usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

//crear user
const createUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Faltan datos' });

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser)
      return res.status(409).json({ message: 'Usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

//editar user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    user.username = username || user.username;
    if (password) {
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

//borrar user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
