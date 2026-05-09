const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Importar rutas
const pokemonRoutes = require('./routes/pokemonRoutes'); // <-- NUEVO

// Middleware
app.use(cors()); 
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = 'mongodb://admin:password123@localhost:27017/pokemon_app?authSource=admin';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB con éxito'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api/status', (req, res) => res.json({ message: '100% Operativo' }));
app.use('/api/pokemon', pokemonRoutes); // <-- NUEVO: Activamos la ruta

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});