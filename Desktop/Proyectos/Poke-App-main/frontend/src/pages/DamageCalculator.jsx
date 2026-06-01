import { useState, useMemo } from 'react';
import Loader from '../components/Loader';
import {
  getEffectiveness, effectivenessLabel, TYPE_ES, calcStat, calcDamage
} from '../utils/typeChart';
import '../css/DamageCalculator.css';

const getPokeImage = (p) => {
  if (!p) return '/placeholder.png';
  if (p.image) return p.image;
  const id = p.pokedexId || p.id;
  if (id) return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  return '/placeholder.png';
};

const normalizeStats = (p) => {
  const s = p?.stats || {};
  return {
    hp: s.hp || 0, attack: s.attack || 0, defense: s.defense || 0,
    spa: s.specialAttack || 0, spd: s.specialDefense || 0, speed: s.speed || 0
  };
};

export default function DamageCalculator() {
  const [attacker, setAttacker] = useState(null);
  const [defender, setDefender] = useState(null);
  const [level, setLevel] = useState(50);
  const [critical, setCritical] = useState(false);

  // Movimiento elegido: { name, type, power, category }
  const [move, setMove] = useState(null);
  const [loadingMove, setLoadingMove] = useState(false);
  const [moveQuery, setMoveQuery] = useState('');
  const [moveDropdownOpen, setMoveDropdownOpen] = useState(false);

  // Buscador de Pokémon (reutiliza la API local, igual que el TeamBuilder)
  const [searchTarget, setSearchTarget] = useState(null); // 'attacker' | 'defender' | null
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const openSearch = (target) => {
    setSearchTarget(target);
    setSearchQuery('');
    setSearchResults([]);
  };
  const closeSearch = () => setSearchTarget(null);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length < 3) { setSearchResults([]); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/pokemon?search=${q}&limit=12`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error buscando:', err);
    }
  };

  const selectPokemon = (p) => {
    if (searchTarget === 'attacker') {
      setAttacker(p);
      setMove(null); // reiniciamos el movimiento al cambiar de atacante
      setMoveQuery('');
    } else {
      setDefender(p);
    }
    closeSearch();
  };

  // Selección de movimiento: traemos potencia/tipo/categoría desde PokeAPI
  const selectMove = async (moveRef) => {
    setMoveDropdownOpen(false);
    setLoadingMove(true);
    try {
      const res = await fetch(moveRef.url);
      const data = await res.json();
      const esName = data.names.find(n => n.language.name === 'es')?.name
        || moveRef.name.replace(/-/g, ' ');
      setMove({
        name: esName,
        type: data.type.name,           // inglés
        power: data.power || 0,
        category: data.damage_class?.name || 'physical' // physical | special | status
      });
    } catch (err) {
      console.error('Error cargando movimiento:', err);
      setMove({ name: moveRef.name.replace(/-/g, ' '), type: 'normal', power: 0, category: 'physical' });
    } finally {
      setLoadingMove(false);
    }
  };

  const attackerMoves = attacker?.moves || [];
  const filteredMoves = useMemo(() => {
    const q = moveQuery.trim().toLowerCase();
    const list = attackerMoves.filter(m => m.name.toLowerCase().includes(q));
    return list.slice(0, 60);
  }, [attackerMoves, moveQuery]);

  // Cálculo de daño
  const result = useMemo(() => {
    if (!attacker || !defender || !move || move.category === 'status' || !move.power) return null;

    const atkStats = normalizeStats(attacker);
    const defStats = normalizeStats(defender);
    const isPhysical = move.category === 'physical';

    const attackBase = isPhysical ? atkStats.attack : atkStats.spa;
    const defenseBase = isPhysical ? defStats.defense : defStats.spd;

    const attack = calcStat(attackBase, level);
    const defense = calcStat(defenseBase, level);
    const defenderHP = calcStat(defStats.hp, level, true);

    const stab = (attacker.types || []).includes(move.type) ? 1.5 : 1;
    const typeEff = getEffectiveness(move.type, defender.types || []);

    const { min, max } = calcDamage({ level, power: move.power, attack, defense, stab, typeEff, critical });

    const pctMin = Math.min(100, Math.round((min / defenderHP) * 100));
    const pctMax = Math.min(100, Math.round((max / defenderHP) * 100));

    // Golpes necesarios para debilitar (con el daño máximo)
    const hitsToKO = max > 0 ? Math.ceil(defenderHP / max) : '∞';

    return { min, max, pctMin, pctMax, defenderHP, stab, typeEff, hitsToKO };
  }, [attacker, defender, move, level, critical]);

  const effLabel = result ? effectivenessLabel(result.typeEff) : null;

  return (
    <div className="container calc-page">
      <h1 className="page-title">Calculadora de Daño ⚔️</h1>

      <div className="calc-grid">
        {/* ATACANTE */}
        <div className="calc-card attacker-card">
          <h3 className="calc-card-title">Atacante</h3>
          <PokeSlot pokemon={attacker} onPick={() => openSearch('attacker')} />

          {attacker && (
            <div className="move-picker">
              <label>Movimiento</label>
              <div className="move-select" onClick={() => setMoveDropdownOpen(o => !o)}>
                {move ? (
                  <span className="move-selected">
                    {move.name}
                    <span className={`type-pill type-${move.type}`}>{TYPE_ES[move.type]}</span>
                    <span className="move-cat">{move.category === 'special' ? 'Esp.' : move.category === 'physical' ? 'Fís.' : 'Estado'}</span>
                    {move.power ? <span className="move-power">Pot. {move.power}</span> : <span className="move-power">—</span>}
                  </span>
                ) : (
                  <span className="move-placeholder">Selecciona un movimiento...</span>
                )}
                <span className="dropdown-caret">▾</span>
              </div>

              {moveDropdownOpen && (
                <div className="move-dropdown">
                  <input
                    className="move-search"
                    placeholder="Filtrar movimientos..."
                    value={moveQuery}
                    onChange={(e) => setMoveQuery(e.target.value)}
                    autoFocus
                  />
                  <div className="move-list">
                    {filteredMoves.length === 0 && <div className="move-empty">Sin resultados</div>}
                    {filteredMoves.map((m) => (
                      <div key={m.name} className="move-option" onClick={() => selectMove(m)}>
                        {m.name.replace(/-/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CONTROLES CENTRALES */}
        <div className="calc-card controls-card">
          <h3 className="calc-card-title">Condiciones</h3>

          <div className="control-field">
            <label>Nivel (atacante y defensor)</label>
            <input
              type="number" min="1" max="100" value={level}
              onChange={(e) => setLevel(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            />
          </div>

          <label className="control-check">
            <input type="checkbox" checked={critical} onChange={(e) => setCritical(e.target.checked)} />
            <span>Golpe crítico (×1.5)</span>
          </label>

          {/* RESULTADO */}
          <div className="result-box">
            {loadingMove ? (
              <Loader text="Cargando movimiento..." size={48} />
            ) : !result ? (
              <p className="result-hint">
                {move?.category === 'status'
                  ? 'Los movimientos de estado no hacen daño.'
                  : 'Elige atacante, defensor y un movimiento para calcular.'}
              </p>
            ) : (
              <>
                <div className="result-eff" style={{ color: effLabel.color }}>{effLabel.text}</div>
                <div className="result-damage">
                  <span className="result-range">{result.min} – {result.max}</span>
                  <span className="result-unit">de daño</span>
                </div>
                <div className="result-bar-bg">
                  <div className="result-bar-fill" style={{ width: `${result.pctMax}%` }} />
                </div>
                <div className="result-pct">{result.pctMin}% – {result.pctMax}% del HP rival ({result.defenderHP} HP)</div>
                <div className="result-extra">
                  {result.stab > 1 && <span className="result-tag">STAB ×1.5</span>}
                  {result.typeEff !== 1 && <span className="result-tag">Tipo ×{result.typeEff}</span>}
                  {critical && <span className="result-tag">Crítico</span>}
                </div>
                {result.max > 0 && (
                  <div className="result-ko">Debilita en <strong>{result.hitsToKO}</strong> golpe(s) (máx.)</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* DEFENSOR */}
        <div className="calc-card defender-card">
          <h3 className="calc-card-title">Defensor</h3>
          <PokeSlot pokemon={defender} onPick={() => openSearch('defender')} />
        </div>
      </div>

      {/* MODAL DE BÚSQUEDA */}
      {searchTarget && (
        <div className="tb-modal-overlay" onClick={closeSearch}>
          <div className="tb-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tb-modal-header">
              <h3>Elegir {searchTarget === 'attacker' ? 'atacante' : 'defensor'}</h3>
              <button className="close-modal-btn" onClick={closeSearch}>✕</button>
            </div>
            <input
              type="text" className="tb-search-input-modal" placeholder="Mín 3 letras..."
              value={searchQuery} onChange={handleSearch} autoFocus
            />
            <div className="tb-modal-results">
              {searchResults.length === 0 && searchQuery.length >= 3 && <p className="no-results-text">Buscando o sin resultados...</p>}
              {searchResults.map((p) => (
                <div key={p.pokedexId || p._id} className="tb-modal-result-item" onClick={() => selectPokemon(p)}>
                  <img src={getPokeImage(p)} alt="Sprite" />
                  <span>{p.name ? String(p.name).toUpperCase() : '???'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PokeSlot({ pokemon, onPick }) {
  if (!pokemon) {
    return (
      <div className="poke-placeholder" onClick={onPick}>
        <div className="add-icon">+</div>
        <span>Elegir Pokémon</span>
      </div>
    );
  }
  return (
    <div className="calc-poke" onClick={onPick}>
      <img src={getPokeImage(pokemon)} alt={pokemon.name} />
      <h4>{String(pokemon.name).toUpperCase()}</h4>
      <div className="calc-poke-types">
        {(pokemon.types || []).map((t) => (
          <span key={t} className={`type-pill type-${t}`}>{TYPE_ES[t] || t}</span>
        ))}
      </div>
      <button className="change-poke-btn" onClick={(e) => { e.stopPropagation(); onPick(); }}>Cambiar</button>
    </div>
  );
}
