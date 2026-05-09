// Ahora le pasamos el objeto pokemon entero
export default function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} />
      <h3>{pokemon.name}</h3>
      {/* Usamos el pokedexId que viene de tu MongoDB */}
      <span className="poke-id">Nº {String(pokemon.pokedexId).padStart(3, '0')}</span>
    </div>
  );
}