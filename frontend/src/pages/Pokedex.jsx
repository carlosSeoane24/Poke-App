import { useEffect, useState } from 'react';
import { getPokemonList } from '../services/pokemonService';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';

export default function Pokedex() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [search, setSearch] = useState(''); 
  const [type, setType] = useState(''); 
  const [sortBy, setSortBy] = useState('pokedexId'); 
  const [order, setOrder] = useState('asc'); 
  
  // 🧭 Nuevos estados para paginación
  const [limit, setLimit] = useState('20');
  const [page, setPage] = useState(1);

  // Si el usuario cambia un filtro (ej: buscar por tipo fuego), 
  // le devolvemos a la página 1 para evitar que se quede en una página vacía.
  useEffect(() => {
    setPage(1);
  }, [search, type, sortBy, order, limit]);

  useEffect(() => {
    const loadPokemons = async () => {
      const data = await getPokemonList({ search, type, sortBy, order, limit, page }); 
      setPokemons(data);
    };

    const delayTimer = setTimeout(() => {
      loadPokemons();
    }, 300);
    
    return () => clearTimeout(delayTimer);
  }, [search, type, sortBy, order, limit, page]);

  const handleClearFilters = () => {
    setSearch('');
    setType('');
    setSortBy('pokedexId');
    setOrder('asc');
    setLimit('20');
    setPage(1);
  };

  const handleNextPokemon = () => {
  // 1. Usamos tu variable 'pokemons' directamente, que es la que se dibuja en pantalla
  const listaActual = pokemons; 

  // 2. Buscamos el índice del Pokémon actual
  const currentIndex = listaActual.findIndex(
    p => p.pokedexId === selectedPokemon.pokedexId || p._id === selectedPokemon._id
  );

  // 3. Navegamos
  if (currentIndex !== -1 && currentIndex < listaActual.length - 1) {
    setSelectedPokemon(listaActual[currentIndex + 1]);
  } else if (currentIndex === listaActual.length - 1) {
    setSelectedPokemon(listaActual[0]); // Bucle al principio
  }
};

const handlePrevPokemon = () => {
  const listaActual = pokemons; 
  const currentIndex = listaActual.findIndex(
    p => p.pokedexId === selectedPokemon.pokedexId || p._id === selectedPokemon._id
  );

  if (currentIndex > 0) {
    setSelectedPokemon(listaActual[currentIndex - 1]);
  } else if (currentIndex === 0) {
    setSelectedPokemon(listaActual[listaActual.length - 1]); // Bucle al final
  }
};

// Saltar a otro pokemon por ID (usado en evoluciones)
const goToPokemonById = (id) => {
  // Buscamos el Pokémon en tu lista local por su ID
  const targetPokemon = pokemons.find(p => p.pokedexId === id || p.id === id);
  
  if (targetPokemon) {
    setSelectedPokemon(targetPokemon); // Esto actualizará el modal al instante
  }
};

const handleNavigate = (newId) => {
  // Buscamos en la lista de pokemons que tenemos cargados
  // Usamos == para que compare aunque uno sea string y otro número
  const newPoke = pokemons.find(p => p.pokedexId == newId);
  
  if (newPoke) {
    setSelectedPokemon(newPoke);
    // Opcional: scroll al principio del modal si fuera muy largo
  } else {
    console.warn("El Pokémon con ID " + newId + " no está cargado en la lista actual.");
    // Aquí podrías hacer una petición al servicio si quisieras buscarlo fuera de la página actual
  }
};

  return (
    <div className="container">
      <h1 className="page-title">Pokédex Nacional</h1>
      
      {/* TARJETA 1: BARRA DE FILTROS (Ya sin el selector de límite) */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Buscador</label>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Nombre o ID..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Tipo Elemental</label>
          <select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">🌍 Todos</option>
            <option value="normal">⚪ Normal</option>
            <option value="fire">🔥 Fuego</option>
            <option value="water">💧 Agua</option>
            <option value="electric">⚡ Eléctrico</option>
            <option value="grass">🌿 Planta</option>
            <option value="ice">❄️ Hielo</option>
            <option value="fighting">🥊 Lucha</option>
            <option value="poison">☠️ Veneno</option>
            <option value="ground">🏜️ Tierra</option>
            <option value="flying">🦅 Volador</option>
            <option value="psychic">🔮 Psíquico</option>
            <option value="bug">🐛 Bicho</option>
            <option value="rock">🪨 Roca</option>
            <option value="ghost">👻 Fantasma</option>
            <option value="dragon">🐉 Dragón</option>
            <option value="dark">🌑 Siniestro</option>
            <option value="steel">⚙️ Acero</option>
            <option value="fairy">✨ Hada</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Atributo</label>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="pokedexId">🔢 Pokédex</option>
            <option value="stats.hp">❤️ Salud (HP)</option>
            <option value="stats.attack">⚔️ Ataque</option>
            <option value="stats.defense">🛡️ Defensa</option>
            <option value="stats.specialAttack">🔥 Atq. Especial</option>
            <option value="stats.specialDefense">✨ Def. Especial</option>
            <option value="stats.speed">👟 Velocidad</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Orden</label>
          <select className="filter-select" value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">🔽 Ascendente</option>
            <option value="desc">🔼 Descendente</option>
          </select>
        </div>

        <div className="filter-group">
          <label>&nbsp;</label>
          <button className="clear-btn" onClick={handleClearFilters}>
            Limpiar
          </button>
        </div>
      </div>

      {/* 📦 TARJETA 2: CONTENEDOR DE LA PÁGINA */}
      <div className="content-card">
        
        {/* LA CUADRÍCULA DE POKÉMON (¡Solo una vez!) */}
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <div key={pokemon._id} onClick={() => setSelectedPokemon(pokemon)} style={{ cursor: 'pointer' }}>
              <PokemonCard pokemon={pokemon} />
            </div>
          ))}
        </div>

        {/* 🧭 NUEVO PIE DE PÁGINA */}
<div className="pagination-container">
  
  {/* IZQUIERDA: Selector de cantidad */}
  <div className="footer-section left">
    <div className="limit-controls">
      <label>Mostrar:</label>
      <select className="limit-select-small" value={limit} onChange={(e) => setLimit(e.target.value)}>
        <option value="20">20 por página</option>
        <option value="50">50 por página</option>
        <option value="100">100 por página</option>
        <option value="200">200 por página</option>
        <option value="300">300 por página</option>
        <option value="400">400 por página</option>
        <option value="500">500 por página</option>
        <option value="600">600 por página</option>
        <option value="700">700 por página</option>
        <option value="800">800 por página</option>
        <option value="900">900 por página</option>
        <option value="1000">1000 por página</option>
        <option value="all">Todos</option>
      </select>
    </div>
  </div>

  {/* CENTRO: Paginación (Anterior / Siguiente) */}
  <div className="footer-section center">
    <div className="pagination-controls">
      {limit !== 'all' && (
        <>
          <button className="page-btn" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
            <span>&larr;</span> Anterior
          </button>
          <span className="page-info">Página {page}</span>
          <button className="page-btn" onClick={() => setPage((prev) => prev + 1)} disabled={pokemons.length < parseInt(limit)}>
            Siguiente <span>&rarr;</span>
          </button>
        </>
      )}
    </div>
  </div>

  {/* DERECHA: Botón de Volver arriba */}
  <div className="footer-section right">
    <button 
      className="scroll-top-btn" 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  </div>

</div>

      </div>

      {/* MODAL: Se renderiza fuera de la tarjeta, flotando por encima */}
      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)}
          onNext={handleNextPokemon}
          onPrev={handlePrevPokemon}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}