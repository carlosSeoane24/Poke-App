// Configuración central del backend.
// Mantiene el estilo del proyecto (valores por defecto) pero permite
// sobreescribir con variables de entorno (.env) si se desea.
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI ||
    'mongodb://admin:password123@localhost:27017/pokemon_app?authSource=admin',
  JWT_SECRET: process.env.JWT_SECRET || 'pokeapp_super_secreto_cambiar_en_produccion',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};
