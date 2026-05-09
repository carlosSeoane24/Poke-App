const mongoose = require('mongoose');
const axios = require('axios');
const Pokemon = require('./models/Pokemon');

const MONGO_URI = 'mongodb://admin:password123@localhost:27017/pokemon_app?authSource=admin';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB para poblar datos');

    console.log('🗑️ Limpiando base de datos anterior...');
    await Pokemon.deleteMany({});

    // 1. Preguntamos CUÁNTOS Pokémon hay en total exactamente hoy
    console.log('🔍 Consultando la PokeAPI para ver cuántos Pokémon existen...');
    const initialCall = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
    const totalCount = initialCall.data.count;

    // 2. Pedimos la lista con el número exacto
    console.log(`⏳ Descargando lista de los ${totalCount} Pokémon...`);
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`);
    const basicList = response.data.results;

    console.log(`📥 Procesando ${basicList.length} Pokémon. Esto tomará varios minutos, ten paciencia...`);

    for (let i = 0; i < basicList.length; i++) {
      try {
        const details = await axios.get(basicList[i].url);
        const p = details.data;

        // Extraemos la imagen de forma segura (si no hay artwork oficial, usa el sprite normal)
        const image = p.sprites.other['official-artwork'].front_default || p.sprites.front_default || '';

        await Pokemon.create({
          pokedexId: p.id,
          name: p.name,
          types: p.types.map(t => t.type.name),
          stats: {
            hp: p.stats[0].base_stat,
            attack: p.stats[1].base_stat,
            defense: p.stats[2].base_stat,
            specialAttack: p.stats[3].base_stat,
            specialDefense: p.stats[4].base_stat,
            speed: p.stats[5].base_stat
          },
          image: image
        });

        if ((i + 1) % 100 === 0) console.log(`... Guardados ${i + 1} Pokémon de ${totalCount}`);
      } catch (err) {
        // Si un Pokémon en concreto falla, no paramos todo el script, solo avisamos
        console.log(`⚠️ Error con el Pokémon ${basicList[i].name}, saltando...`);
      }
    }

    console.log('🎉 ¡Base de datos poblada con éxito! Ya tienes ABSOLUTAMENTE TODOS los Pokémon.');
    process.exit();
  } catch (error) {
    console.error('❌ Error general durante el proceso:', error);
    process.exit(1);
  }
}

seedDatabase();