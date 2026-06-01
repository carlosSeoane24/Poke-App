const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { PORT, MONGO_URI } = require('./config');

const app = express();

// Importar rutas
const pokemonRoutes = require('./routes/pokemonRoutes');
const authRoutes = require('./routes/authRoutes');     // <-- NUEVO: autenticación
const teamRoutes = require('./routes/teamRoutes');     // <-- NUEVO: equipos

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB con éxito'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api/status', (req, res) => res.json({ message: '100% Operativo' }));
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/auth', authRoutes);   // <-- NUEVO
app.use('/api/teams', teamRoutes);  // <-- NUEVO

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
