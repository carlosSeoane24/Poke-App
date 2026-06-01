const mongoose = require('mongoose');

// Guardamos cada ranura del equipo de forma flexible (Mixed) para que
// coincida 1:1 con la estructura que ya usa el TeamBuilder del frontend.
const teamSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Equipo sin nombre'
  },
  // Array de 6 ranuras tal cual las maneja el frontend
  slots: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
