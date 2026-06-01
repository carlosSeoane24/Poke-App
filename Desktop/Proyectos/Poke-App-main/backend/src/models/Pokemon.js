const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  pokedexId: Number,
  name: String,
  image: String,
  types: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    specialAttack: Number,
    specialDefense: Number,
    speed: Number
  },
  description: String,
  generation: String,
  evolutions: [{
    name: String,
    id: String,
    method: String,
    sprite: String
  }],
  moves: [{
    name: String,
    url: String,
    level: Number,
    methodRaw: String
  }]
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;