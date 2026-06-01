const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

const signToken = (user) =>
  jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// 📝 REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // ¿Ya existe ese usuario o email?
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (exists) {
      return res.status(409).json({ message: 'El usuario o el email ya están registrados' });
    }

    const user = await User.create({ username, email, password });
    const token = signToken(user);

    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 🔑 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email o username

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 👤 PERFIL (usuario actual a partir del token)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
