// backend/seedCompleto.js
const mongoose = require('mongoose');

// --- 1. ESQUEMA (Igual al que ya tienes) ---
if (mongoose.models.Pokemon) {
  delete mongoose.models.Pokemon;
}

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

// --- 2. CONEXIÓN ---
mongoose.connect('mongodb://admin:password123@localhost:27017/pokemon_app?authSource=admin')
  .then(() => console.log('🟢 CONECTADO A MONGODB'))
  .catch(err => console.error('🔴 ERROR DE CONEXIÓN:', err));

// --- 3. FUNCIÓN DE APOYO PARA PAUSAS ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 4. SEEDER MASIVO ---
async function seedTodaLaPokedex() {
  try {
    console.log('🗑️ Limpiando base de datos anterior...');
    await Pokemon.deleteMany({});

    // 1025 es el número actual de Pokémon con datos completos hasta Gen 9
    const TOTAL_POKEMON = 1025; 
    console.log(`🔍 Preparando la descarga de ${TOTAL_POKEMON} Pokémon...`);
    
    const listRes = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}`);
    const listData = await listRes.json();
    
    // Procesaremos en bloques de 10 para no ser "baneados" por la API
    const batchSize = 10;
    
    for (let i = 0; i < listData.results.length; i += batchSize) {
      const batch = listData.results.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (item) => {
        const id = item.url.split('/').slice(-2, -1)[0];

        try {
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const p = await pokeRes.json();

          const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          const speciesData = await speciesRes.json();

          // Descripción en español
          const spanishEntry = speciesData.flavor_text_entries.find(e => e.language.name === 'es');
          const description = spanishEntry ? spanishEntry.flavor_text.replace(/[\n\f\r]/g, ' ') : "Sin datos.";
          const generation = speciesData.generation ? speciesData.generation.name.replace('generation-', 'Gen ').toUpperCase() : "Gen I";

          // Cadena Evolutiva
          // --- FUNCIÓN RECURSIVA PARA EXPLORAR TODAS LAS RAMAS ---
          function parseEvoChain(chain, result = []) {
            const evoId = chain.species.url.split('/').slice(-2, -1)[0];
            const details = chain.evolution_details[0];
            
            let method = "Base";
            if (details) {
              if (details.min_level) method = `Nivel ${details.min_level}`;
              else if (details.item) method = details.item.name.replace(/-/g, ' ');
              else if (details.min_happiness) method = "Amistad";
              else if (details.trigger?.name === 'trade') method = "Intercambio";
              else method = "Especial";
            }

            result.push({
              name: chain.species.name,
              id: evoId,
              method: method,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`            
            });

            // Si tiene evoluciones (aunque sean varias como Eevee), las recorremos todas
            if (chain.evolves_to && chain.evolves_to.length > 0) {
              chain.evolves_to.forEach(nextEvo => {
                parseEvoChain(nextEvo, result);
              });
            }

            return result;
          }

          // --- DENTRO DE TU BUCLE PRINCIPAL DEL SEEDER ---
          // Sustituye el antiguo "while(currentEvo)" por esto:
          let evolutions = [];
          if (speciesData.evolution_chain) {
            const evoRes = await fetch(speciesData.evolution_chain.url);
            const evoData = await evoRes.json();
            // Llamamos a la función mágica que recorre todo el árbol
            evolutions = parseEvoChain(evoData.chain);
          }

          // Movimientos optimizados
          let movesArray = p.moves.map(m => {
            const versionDetails = m.version_group_details[m.version_group_details.length - 1];
            return {
              name: m.move.name,
              url: m.move.url,
              level: versionDetails ? versionDetails.level_learned_at : 0,
              methodRaw: versionDetails ? versionDetails.move_learn_method.name : 'unknown'
            };
          });

          const image = p.sprites.other['official-artwork'].front_default || p.sprites.front_default || '';

          await Pokemon.create({
            pokedexId: p.id,
            name: p.name,
            image: image,
            types: p.types.map(t => t.type.name),
            stats: {
              hp: p.stats[0].base_stat,
              attack: p.stats[1].base_stat,
              defense: p.stats[2].base_stat,
              specialAttack: p.stats[3].base_stat,
              specialDefense: p.stats[4].base_stat,
              speed: p.stats[5].base_stat
            },
            description: description,
            generation: generation,
            evolutions: evolutions,
            moves: movesArray
          });

          console.log(`✅ [${p.id}/${TOTAL_POKEMON}] ${p.name.toUpperCase()} guardado.`);
          
        } catch (err) {
          console.log(`⚠️ Error con el ID ${id}: ${err.message}`);
        }
      }));

      // Esperamos 200ms entre bloques para ser respetuosos con la API
      await wait(200); 
    }

    console.log('\n🎉 ¡TODA LA POKÉDEX HA SIDO IMPORTADA!');
    process.exit();

  } catch (error) {
    console.error('❌ Error general:', error);
    process.exit(1);
  }
}

seedTodaLaPokedex();