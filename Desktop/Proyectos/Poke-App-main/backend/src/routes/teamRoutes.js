const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const auth = require('../middleware/auth');

// Todas las rutas de equipos requieren estar autenticado
router.use(auth);

// 📋 LISTAR los equipos del usuario
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ owner: req.userId }).sort({ updatedAt: -1 });
    res.json(teams);
  } catch (error) {
    console.error('Error listando equipos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 🔍 OBTENER un equipo concreto
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, owner: req.userId });
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json(team);
  } catch (error) {
    console.error('Error obteniendo equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 💾 CREAR un equipo
router.post('/', async (req, res) => {
  try {
    const { name, slots } = req.body;
    const team = await Team.create({
      owner: req.userId,
      name: name?.trim() || 'Equipo sin nombre',
      slots: Array.isArray(slots) ? slots : []
    });
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creando equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✏️ ACTUALIZAR un equipo (sobrescribe nombre y ranuras)
router.put('/:id', async (req, res) => {
  try {
    const { name, slots } = req.body;
    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      {
        ...(name !== undefined ? { name: name.trim() || 'Equipo sin nombre' } : {}),
        ...(slots !== undefined ? { slots: Array.isArray(slots) ? slots : [] } : {})
      },
      { new: true }
    );
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json(team);
  } catch (error) {
    console.error('Error actualizando equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// 🗑️ BORRAR un equipo
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!team) return res.status(404).json({ message: 'Equipo no encontrado' });
    res.json({ message: 'Equipo eliminado', id: req.params.id });
  } catch (error) {
    console.error('Error borrando equipo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
