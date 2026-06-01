const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokemon');

router.get('/', async (req, res) => {
  try {
    // Añadimos limit y page a los parámetros que recibimos (por defecto 20 y página 1)
    const { type, sortBy, order, search, limit = '20', page = '1' } = req.query; 
    let query = {};
    
    if (search) {
      if (!isNaN(search)) {
        query.pokedexId = Number(search);
      } else {
        query.name = { $regex: search, $options: 'i' };
      }
    }

    if (type) query.types = type;

    let sortConfig = { pokedexId: 1 };
    if (sortBy) {
      sortConfig = {};
      sortConfig[sortBy] = order === 'desc' ? -1 : 1; 
    }

    let dbQuery = Pokemon.find(query).sort(sortConfig);

    // 🧠 LÓGICA DE PAGINACIÓN
    if (limit !== 'all') {
      const numLimit = parseInt(limit, 10);
      const numPage = parseInt(page, 10);
      // Skip: se salta los resultados de las páginas anteriores
      // Limit: coge solo los que le caben en esta página
      dbQuery = dbQuery.skip((numPage - 1) * numLimit).limit(numLimit);
    }

    const pokemons = await dbQuery;
    res.json(pokemons);
  } catch (error) {
    console.error("Error obteniendo Pokémon:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscamos por pokedexId, no por el _id de MongoDB
    const pokemon = await Pokemon.findOne({ pokedexId: parseInt(id, 10) });

    if (!pokemon) {
      return res.status(404).json({ message: "Pokémon no encontrado" });
    }

    res.json(pokemon);
  } catch (error) {
    console.error("Error al buscar Pokémon por ID:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;