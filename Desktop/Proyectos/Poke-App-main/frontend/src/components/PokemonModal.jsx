import { useState, useEffect } from 'react';
import './PokemonModal.css';
import MoveRow from './MoveRow';

export default function PokemonModal({ pokemon, onClose, onNext, onPrev, onNavigate }) {
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    setActiveTab('info');
  }, [pokemon]);

  if (!pokemon) return null;

  const calculateBarWidth = (value) => `${Math.min((value / 255) * 100, 100)}%`;

  const handleCloseClick = (e) => {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-wrapper')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseClick}>
      <div className="modal-wrapper">
        
        {/* ⬅️ BOTÓN FLOTANTE IZQUIERDO */}
        <button className="floating-arrow left" onClick={onPrev}>❮</button>

        {/* --- LA TARJETA BLANCA --- */}
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>&times;</button>
          
          <div className="modal-body">
            
            {/* 👇 CAJA DE IMAGEN CON TAMAÑO FIJO BLINDADO 👇 */}
            <div 
              className="modal-image-container" 
              style={{ 
                width: '250px',        /* Ancho fijo siempre */
                height: '250px',       /* Alto fijo siempre */
                flexShrink: 0,         /* Impide que la caja se encoja */
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              <img 
                src={pokemon.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.pokedexId}.png`} 
                alt={pokemon.name} 
                className="main-pokemon-img"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' /* Hace que la foto encaje sin deformarse ni salirse */
                }}
              />
            </div>
            {/* 👆 FIN DEL CAMBIO DE LA IMAGEN 👆 */}

            {/* DERECHA: Info interactiva */}
            <div className="modal-info">
              
              {/* HEADER: ID y Generación juntos, Nombre y Tipos debajo */}
              <div className="modal-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <p className="modal-id" style={{ margin: 0, color: '#64748b', fontWeight: 'bold' }}>
                  Nº {String(pokemon.pokedexId).padStart(4, '0')} • {pokemon.generation || "Desconocida"}
                </p>
                <h2 className="modal-title" style={{ margin: '4px 0' }}>
                  {pokemon.name}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {pokemon.types?.map(type => (
                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* 🗂️ MENÚ DE PESTAÑAS */}
              <div className="modal-tabs">
                <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                  Info & Stats
                </button>
                <button className={`tab-btn ${activeTab === 'evo' ? 'active' : ''}`} onClick={() => setActiveTab('evo')}>
                  Evoluciones
                </button>
                <button className={`tab-btn ${activeTab === 'moves' ? 'active' : ''}`} onClick={() => setActiveTab('moves')}>
                  Movimientos
                </button>
              </div>

              {/* 📝 CONTENIDO DE LA PESTAÑA: INFO & STATS */}
              {activeTab === 'info' && (
                <div className="tab-content animate-fade">
                  <p className="modal-description">{pokemon.description || "Buscando descripción..."}</p>
                  <div className="stats-container">
                    <StatRow name="HP" value={pokemon.stats?.hp || 0} color="#10b981" />
                    <StatRow name="Ataque" value={pokemon.stats?.attack || 0} color="#ef4444" />
                    <StatRow name="Defensa" value={pokemon.stats?.defense || 0} color="#f59e0b" />
                    <StatRow name="Atq. Esp" value={pokemon.stats?.specialAttack || 0} color="#8b5cf6" />
                    <StatRow name="Def. Esp" value={pokemon.stats?.specialDefense || 0} color="#ec4899" />
                    <StatRow name="Velocidad" value={pokemon.stats?.speed || 0} color="#3b82f6" />
                  </div>
                </div>
              )}

              {/* 🧬 CONTENIDO DE LA PESTAÑA: EVOLUCIONES */}
              {activeTab === 'evo' && (
                <div className="tab-content animate-fade">
                  <div className="evo-chain-container">
                    {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
                      pokemon.evolutions.map((evo, index) => (
                        <div key={evo.id} className="evo-item-wrapper">
                          <div 
                            className="evo-step" 
                            onClick={() => onNavigate && onNavigate(evo.id)} 
                            title={`Ir a ${evo.name}`}
                          >
                            <div className="evo-sprite-box">
                              <img src={evo.sprite} alt={evo.name} className="evo-pixel-sprite" />
                            </div>
                            <span className="evo-name">{evo.name}</span>
                          </div>

                          {index < pokemon.evolutions.length - 1 && (
                            <div className="evo-arrow-container">
                              <span className="evo-method-text">
                                {pokemon.evolutions[index + 1]?.method || "Especial"}
                              </span>
                              <span className="evo-arrow-icon">➜</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-data">Este Pokémon no tiene evoluciones.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ⚔️ CONTENIDO DE LA PESTAÑA: MOVIMIENTOS */}
              {activeTab === 'moves' && (
                <div className="tab-content animate-fade">
                  <div className="moves-section">
                    <div className="table-wrapper">
                      <table className="moves-table">
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', paddingLeft: '10px' }}>Ataque</th>
                            <th>Tipo</th>
                            <th>Pot.</th>
                            <th>PP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pokemon.moves?.map((move, idx) => (
                            <MoveRow key={idx} moveData={move} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ➡️ BOTÓN FLOTANTE DERECHO */}
        <button className="floating-arrow right" onClick={onNext}>❯</button>

      </div>
    </div>
  );

  function StatRow({ name, value, color }) {
    return (
      <div className="stat-row">
        <span className="stat-name">{name}</span>
        <span className="stat-value">{value}</span>
        <div className="stat-bar-bg">
          <div className="stat-bar-fill" style={{ width: calculateBarWidth(value), backgroundColor: color }}></div>
        </div>
      </div>
    );
  }
}