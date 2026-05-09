import React, { useState } from 'react';
import '../css/TeamBuilder.css'; 

const NATURES = {
  Fuerte: { plus: null, minus: null }, Huraña: { plus: 'atk', minus: 'def' }, Audaz: { plus: 'atk', minus: 'spe' },
  Firme: { plus: 'atk', minus: 'spa' }, Pícara: { plus: 'atk', minus: 'spd' }, Osada: { plus: 'def', minus: 'atk' },
  Dócil: { plus: null, minus: null }, Plácida: { plus: 'def', minus: 'spe' }, Agitada: { plus: 'def', minus: 'spa' },
  Floja: { plus: 'def', minus: 'spd' }, Miedosa: { plus: 'spe', minus: 'atk' }, Activa: { plus: 'spe', minus: 'def' },
  Seria: { plus: null, minus: null }, Alegre: { plus: 'spe', minus: 'spa' }, Ingenua: { plus: 'spe', minus: 'spd' },
  Modesta: { plus: 'spa', minus: 'atk' }, Afable: { plus: 'spa', minus: 'def' }, Mansa: { plus: 'spa', minus: 'spe' },
  Tímida: { plus: null, minus: null }, Alocada: { plus: 'spa', minus: 'spd' }, Serena: { plus: 'spd', minus: 'atk' },
  Amable: { plus: 'spd', minus: 'def' }, Grosera: { plus: 'spd', minus: 'spe' }, Cauta: { plus: 'spd', minus: 'spa' },
  Rara: { plus: null, minus: null }
};

const STAT_LABELS = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };

const TYPE_TRANSLATIONS = {
  "Normal": "normal", "Fuego": "fire", "Agua": "water", "Planta": "grass", "Eléctrico": "electric", "Hielo": "ice",
  "Lucha": "fighting", "Veneno": "poison", "Tierra": "ground", "Volador": "flying", "Psíquico": "psychic", "Bicho": "bug",
  "Roca": "rock", "Fantasma": "ghost", "Dragón": "dragon", "Siniestro": "dark", "Acero": "steel", "Hada": "fairy"
};

const API_TYPE_TO_ES = {
  "normal": "Normal", "fire": "Fuego", "water": "Agua", "grass": "Planta", "electric": "Eléctrico", "ice": "Hielo",
  "fighting": "Lucha", "poison": "Veneno", "ground": "Tierra", "flying": "Volador", "psychic": "Psíquico", "bug": "Bicho",
  "rock": "Roca", "ghost": "Fantasma", "dragon": "Dragón", "dark": "Siniestro", "steel": "Acero", "fairy": "Hada"
};

const COMPETITIVE_ITEMS = {
  "Objetos de Curación": {
    "Restos": "leftovers", "Lodo Negro": "black-sludge", "Campana Concha": "shell-bell", "Zumo de Baya": "berry-juice"
  },
  "Bayas Competitivas": {
    "Baya Zidra": "sitrus-berry", "Baya Ziuela": "lum-berry", "Baya Atania": "chesto-berry", "Baya Meloc": "pecha-berry", "Baya Aranja": "oran-berry",
    "Baya Higog": "figy-berry", "Baya Wiki": "wiki-berry", "Baya Mago": "mago-berry", "Baya Aguav": "aguav-berry", "Baya Pabaya": "iapapa-berry",
    "Baya Aslac": "salac-berry", "Baya Chiri": "liechi-berry", "Baya Yapati": "petaya-berry", "Baya Lichi": "ganlon-berry", "Baya Aricoc": "apicot-berry",
    "Baya Acardo (Fuego)": "occa-berry", "Baya Pasio (Agua)": "passho-berry", "Baya Gualot (Eléct)": "wacan-berry", "Baya Tamar (Planta)": "rindo-berry", "Baya Caoba (Hielo)": "yache-berry", 
    "Baya Goya (Lucha)": "chople-berry", "Baya Kebia (Veneno)": "kebia-berry", "Baya Chuca (Tierra)": "shuca-berry", "Baya Kouba (Volador)": "coba-berry", "Baya Payapa (Psíq)": "payapa-berry", 
    "Baya Yecana (Bicho)": "tanga-berry", "Baya Alcho (Roca)": "charti-berry", "Baya Dillo (Fantas)": "kasib-berry", "Baya Drasi (Dragón)": "haban-berry", "Baya Anjiro (Sinies)": "colbur-berry", 
    "Baya Pomelo (Acero)": "babiri-berry", "Baya Chilan (Normal)": "chilan-berry", "Baya Maranga": "maranga-berry", "Baya Biglia": "kee-berry"
  },
  "Objetos Ofensivos": {
    "Vidasfera": "life-orb", "Cinta Elegida": "choice-band", "Gafas Elegidas": "choice-specs", "Cinta Experto": "expert-belt", 
    "Energía Potenciadora": "booster-energy", "Dado Trucado": "loaded-dice", "Llamasfera": "flame-orb", "Toxosfera": "toxic-orb",
    "Semilla Milagro": "miracle-seed", "Agua Mística": "mystic-water", "Gafas de Sol": "black-glasses", "Imán": "magnet", 
    "Pico Afilado": "sharp-beak", "Polvo Plata": "silver-powder", "Hechizo": "spell-tag", "Cinturón Negro": "black-belt", 
    "Arena Fina": "soft-sand", "Diente Dragón": "dragon-fang", "Cinta Fuerte": "muscle-band", "Gafas Especiales": "wise-glasses"
  },
  "Objetos Defensivos / Apoyo": {
    "Chaleco Asalto": "assault-vest", "Mineral Evolutivo": "eviolite", "Casco Dentado": "rocky-helmet", "Botas Gruesas": "heavy-duty-boots", 
    "Banda Focus": "focus-sash", "Globo Helio": "air-balloon", "Seguro Debilidad": "weakness-policy", "Polvo Brillo": "bright-powder", 
    "Capa Furtiva": "covert-cloak", "Gafas Protectoras": "safety-goggles", "Muda Concha": "shed-shell"
  },
  "Objetos Utilitarios / Clima": {
    "Pañuelo Elegido": "choice-scarf", "Hierba Blanca": "white-herb", "Hierba Mental": "mental-herb", "Hierba Copia": "mirror-herb",
    "Botón Escape": "eject-button", "Mochila Escape": "eject-pack", "Tarjeta Roja": "red-card", "Luz Arcilla": "light-clay", 
    "Roca Calor": "heat-rock", "Roca Lluvia": "damp-rock", "Roca Suave": "smooth-rock", "Roca Helada": "icy-rock", "Cola Plúmbea": "iron-ball"
  },
  "Megapiedras": {
    "Venusaurita": "venusaurite", "Charizardita X": "charizardite-x", "Charizardita Y": "charizardite-y", "Blastoiseita": "blastoisinite", 
    "Alakazamita": "alakazite", "Gengarita": "gengarite", "Kangaskhanita": "kangaskhanite", "Pinsirita": "pinsirite", "Gyaradosita": "gyaradosite", 
    "Aerodactylita": "aerodactylite", "Mewtwoita X": "mewtwonite-x", "Mewtwoita Y": "mewtwonite-y", "Ampharosita": "ampharosite", 
    "Scizorita": "scizorite", "Heracrossita": "heracronite", "Houndoomita": "houndoominite", "Tyranitarita": "tyranitarite", 
    "Blazikenita": "blazikenite", "Gardevoirita": "gardevoirite", "Mawilita": "mawilite", "Aggronita": "aggronite", "Medichamita": "medichamite", 
    "Manectricita": "manectite", "Banettita": "banettite", "Absolita": "absolite", "Garchompita": "garchompite", "Lucarita": "lucarionite", 
    "Abomasnowita": "abomasite", "Beedrillita": "beedrillite", "Pidgeotita": "pidgeotite", "Slowbronita": "slowbronite", "Steelixita": "steelixite", 
    "Sceptilita": "sceptilite", "Swampertita": "swampertite", "Sharpedonita": "sharpedonite", "Cameruptita": "cameruptite", 
    "Altarianita": "altarianite", "Glalitita": "glalitite", "Salamencita": "salamencite", "Metagrossita": "metagrossite", 
    "Latiasita": "latiasite", "Latiosita": "latiosite", "Lopunnita": "lopunnite", "Galladita": "galladite", "Audinita": "audinite", "Diancita": "diancite"
  }
};

const getItemSprite = (itemName) => {
  for (const category of Object.values(COMPETITIVE_ITEMS)) {
    if (category[itemName]) return category[itemName];
  }
  return null;
};

const TeamBuilder = () => {
  const [team, setTeam] = useState(Array(6).fill(null).map(() => ({
    pokemon: null, item: '', ability: '', abilityOptions: [], nature: 'Seria', 
    moves: [null, null, null, null], availableMoves: [], evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
  })));

  const [searchModal, setSearchModal] = useState({ isOpen: false, slotIndex: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [activeMoveDropdown, setActiveMoveDropdown] = useState(null); 
  const [activeItemDropdown, setActiveItemDropdown] = useState(null); 

  const formatNature = (natName) => {
    const nat = NATURES[natName];
    if (!nat || !nat.plus) return `${natName} (Neutra)`;
    return `${natName} (+${STAT_LABELS[nat.plus]} -${STAT_LABELS[nat.minus]})`;
  };

  const getPokeImage = (p) => {
    if (!p) return '/placeholder.png';
    if (p.image) return p.image;
    const id = p.pokedexId || p.id || p.num;
    if (id) return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return '/placeholder.png';
  };

  const getEnglishType = (type) => {
    return TYPE_TRANSLATIONS[type] || String(type).toLowerCase();
  };

  const extractTypes = (p) => {
    if (!p || !p.types) return [];
    return p.types.map(t => typeof t === 'string' ? t : (t.name || String(t)));
  };

  const calculateTotalStat = (base, ev, statName, nature) => {
    const iv = 31; const level = 50;
    if (statName === 'hp') {
      return Math.floor(0.5 * (2 * base + iv + Math.floor(ev / 4))) + level + 10;
    }
    let val = Math.floor(0.5 * (2 * base + iv + Math.floor(ev / 4))) + 5;
    const natureEffect = NATURES[nature];
    if (natureEffect.plus === statName) val = Math.floor(val * 1.1);
    if (natureEffect.minus === statName) val = Math.floor(val * 0.9);
    return val;
  };

  const openSearch = (index) => {
    setSearchModal({ isOpen: true, slotIndex: index });
    setSearchQuery("");
    setSearchResults([]);
  };

  const closeSearch = () => { setSearchModal({ isOpen: false, slotIndex: null }); };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const response = await fetch(`http://localhost:5000/api/pokemon?search=${query}&limit=12`);
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Error buscando:", error); }
  };

  const selectPokemon = async (pokemonRaw) => {
    const index = searchModal.slotIndex;
    const newTeam = [...team];
    
    const statsObj = pokemonRaw.stats || {};
    let baseStats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    
    if (Array.isArray(statsObj)) {
      baseStats = {
        hp: statsObj.find(s => s.name === 'hp' || s?.stat?.name === 'hp')?.value || 0,
        atk: statsObj.find(s => s.name === 'attack' || s.name === 'atk' || s?.stat?.name === 'attack')?.value || 0,
        def: statsObj.find(s => s.name === 'defense' || s.name === 'def' || s?.stat?.name === 'defense')?.value || 0,
        spa: statsObj.find(s => s.name === 'specialAttack' || s.name === 'spa' || s?.stat?.name === 'special-attack')?.value || 0,
        spd: statsObj.find(s => s.name === 'specialDefense' || s.name === 'spd' || s?.stat?.name === 'special-defense')?.value || 0,
        spe: statsObj.find(s => s.name === 'speed' || s.name === 'spe' || s?.stat?.name === 'speed')?.value || 0,
      };
    } else {
      baseStats = { hp: statsObj.hp || 0, atk: statsObj.attack || 0, def: statsObj.defense || 0, spa: statsObj.specialAttack || 0, spd: statsObj.specialDefense || 0, spe: statsObj.speed || 0 };
    }

    newTeam[index].pokemon = { ...pokemonRaw, baseStats };
    newTeam[index].item = '';
    newTeam[index].ability = 'Cargando...';
    newTeam[index].abilityOptions = [];
    newTeam[index].moves = [null, null, null, null];
    newTeam[index].availableMoves = []; 
    newTeam[index].evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    newTeam[index].nature = 'Seria';

    setTeam([...newTeam]);
    closeSearch();

    const id = pokemonRaw.pokedexId || pokemonRaw.id;
    if (id) {
      try {
        const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokeData = await pokeRes.json();
        
        const abilityPromises = pokeData.abilities.map(async (a) => {
          try {
            const abRes = await fetch(a.ability.url);
            const abData = await abRes.json();
            const esNameObj = abData.names.find(n => n.language.name === 'es');
            const finalName = esNameObj ? esNameObj.name : a.ability.name.replace(/-/g, ' ');
            return a.is_hidden ? `${finalName} (Oculta)` : finalName;
          } catch(err) {
            const fallbackName = a.ability.name.replace(/-/g, ' ');
            return a.is_hidden ? `${fallbackName} (Oculta)` : fallbackName;
          }
        });
        
        const apiAbilities = await Promise.all(abilityPromises);
        newTeam[index].abilityOptions = apiAbilities;
        newTeam[index].ability = apiAbilities.length > 0 ? apiAbilities[0] : 'Desconocida';
        setTeam([...newTeam]); 
        
        const rawMovesList = pokeData.moves.slice(0, 50).map(m => m.move.name);
        
        const movePromises = rawMovesList.map(async (moveName) => {
          try {
            const mRes = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
            const mData = await mRes.json();
            
            const esNameObj = mData.names.find(n => n.language.name === 'es');
            const esName = esNameObj ? esNameObj.name : mData.name.replace(/-/g, ' ');
            const tipoEspanol = API_TYPE_TO_ES[mData.type.name] || "Normal";
            
            return {
              name: esName,
              type: tipoEspanol,
              power: mData.power || '-',
              pp: mData.pp || '-'
            };
          } catch(err) {
            return { name: moveName, type: 'Normal', power: '-', pp: '-' };
          }
        });

        const fullDetailedMoves = await Promise.all(movePromises);
        
        setTeam(currentTeam => {
          const updatedTeam = [...currentTeam];
          if(updatedTeam[index].pokemon) {
            // 🌟 AQUÍ ESTÁ LA NUEVA ORDENACIÓN: PRIMERO POR TIPO, LUEGO POR NOMBRE
            updatedTeam[index].availableMoves = fullDetailedMoves.sort((a, b) => {
              if (a.type < b.type) return -1;
              if (a.type > b.type) return 1;
              return a.name.localeCompare(b.name);
            });
          }
          return updatedTeam;
        });

      } catch (e) {
        console.error("Error al cargar datos de la API para", id, e);
      }
    }
  };

  const clearSlot = (index) => {
    const newTeam = [...team];
    newTeam[index] = { pokemon: null, item: '', ability: '', abilityOptions: [], nature: 'Seria', moves: [null, null, null, null], availableMoves: [], evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } };
    setTeam(newTeam);
  };

  const getStatBarInfo = (slot, stat) => {
    if (!slot.pokemon) return { width: '0%', color: '#3b82f6', modifier: '' };
    const base = slot.pokemon.baseStats?.[stat] || 0;
    const ev = slot.evs[stat] || 0;
    const natureEffect = NATURES[slot.nature] || NATURES['Seria'];
    
    const visualValue = base + (ev / 4);
    const widthPercentage = Math.min(100, (visualValue / 200) * 100);

    let color = '#3b82f6'; // Azul Neutro
    let modifier = '';

    if (natureEffect.plus === stat) { color = '#10b981'; modifier = '(+)'; } // Verde (+)
    else if (natureEffect.minus === stat) { color = '#ef4444'; modifier = '(-)'; } // Rojo (-)

    return { width: `${widthPercentage}%`, color, modifier };
  };

  return (
    <div className="container tb-page" onClick={() => { setActiveMoveDropdown(null); setActiveItemDropdown(null); }}>
      <div className="team-builder-header">
        <h1 className="page-title">Team Builder</h1>
        <div className="team-actions">
          <button className="page-btn clear-btn" onClick={() => setTeam(Array(6).fill(null).map(() => ({ pokemon: null, item: '', ability: '', abilityOptions: [], nature: 'Seria', moves: [null, null, null, null], availableMoves: [], evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 } })))}>
            🗑️ Limpiar Todo
          </button>
        </div>
      </div>

      <div className="team-list">
        {team.map((slot, index) => (
          <div key={index} className={`team-row ${slot.pokemon ? 'filled-row' : 'empty-row'}`}>
            
            <div className="row-section section-poke">
              {slot.pokemon ? (
                <>
                  <div className="poke-sprite-container" onClick={() => openSearch(index)}>
                    <img src={getPokeImage(slot.pokemon)} alt={slot.pokemon.name} />
                  </div>
                  <h3 className="poke-name">{String(slot.pokemon.name).toUpperCase()}</h3>
                  <div className="poke-types">
                    {extractTypes(slot.pokemon).map((t, i) => (
                      <span key={i} className={`type-pill type-${getEnglishType(t)}`}>{t}</span>
                    ))}
                  </div>
                  <button className="delete-poke-btn" onClick={(e) => { e.stopPropagation(); clearSlot(index); }}>✕</button>
                </>
              ) : (
                <div className="poke-placeholder" onClick={() => openSearch(index)}>
                  <div className="add-icon">+</div>
                  <span>Añadir</span>
                </div>
              )}
            </div>

            {slot.pokemon && (
              <>
                <div className="row-section section-details">
                  <div className="input-group relative-group">
                    <label>Objeto</label>
                    <div className="item-input-wrapper" onClick={(e) => { e.stopPropagation(); setActiveItemDropdown({ slot: index }); setActiveMoveDropdown(null); }}>
                      {slot.item && getItemSprite(slot.item) && (
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${getItemSprite(slot.item)}.png`} alt="item" className="item-mini-sprite" onError={(e) => e.target.style.display='none'}/>
                      )}
                      <input type="text" readOnly className="item-input-field" placeholder="Seleccionar objeto..." value={slot.item} />
                    </div>
                    
                    {activeItemDropdown?.slot === index && (
                      <div className="custom-dropdown item-dropdown">
                        {Object.entries(COMPETITIVE_ITEMS).map(([category, items]) => (
                          <React.Fragment key={category}>
                            <div className="dropdown-category">{category}</div>
                            {Object.keys(items).map(itemName => (
                              <div key={itemName} className="dropdown-row" onClick={() => { 
                                const newTeam = [...team]; newTeam[index].item = itemName; setTeam(newTeam); setActiveItemDropdown(null); 
                              }}>
                                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${items[itemName]}.png`} alt={itemName} style={{width: '24px', marginRight: '8px'}} onError={(e) => e.target.style.display='none'} />
                                <span style={{fontSize: '0.8rem', fontWeight: 'bold'}}>{itemName}</span>
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="input-group">
                    <label>Habilidad</label>
                    <select className="tb-input" value={slot.ability} onChange={(e) => { const newTeam = [...team]; newTeam[index].ability = e.target.value; setTeam(newTeam); }}>
                      <option value="">{slot.ability === 'Cargando...' ? 'Cargando...' : 'Seleccionar...'}</option>
                      {slot.abilityOptions.map((abi, i) => (
                        <option key={i} value={abi}>{abi}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row-section section-moves">
                  <label className="section-label">Movimientos</label>
                  <div className="moves-grid-inputs">
                    {slot.moves.map((moveObj, mIndex) => (
                      <div key={mIndex} className="relative-group">
                        <div className="move-input-display" onClick={(e) => { e.stopPropagation(); setActiveMoveDropdown({ slot: index, moveIndex: mIndex }); setActiveItemDropdown(null); }}>
                          <span className="move-display-name">{moveObj ? moveObj.name : `Ataque ${mIndex + 1}`}</span>
                          {moveObj && <span className={`type-pill type-${getEnglishType(moveObj.type)}`}>{moveObj.type}</span>}
                        </div>
                        
                        {activeMoveDropdown?.slot === index && activeMoveDropdown?.moveIndex === mIndex && (
                          <div className="custom-dropdown move-dropdown">
                            <div className="dropdown-header">
                              <span>Ataque</span><span>Tipo</span><span>Pot</span><span>PP</span>
                            </div>
                            
                            {slot.availableMoves.length === 0 ? (
                              <div className="dropdown-row"><span style={{color: '#64748b', fontSize: '0.8rem'}}>Traduciendo ataques... ⏳</span></div>
                            ) : (
                              slot.availableMoves.map((m, i) => (
                                <div key={i} className="dropdown-row move-row" onClick={() => {
                                  const newTeam = [...team]; newTeam[index].moves[mIndex] = m; setTeam(newTeam); setActiveMoveDropdown(null);
                                }}>
                                  <span className="m-name">{m.name}</span>
                                  <span className={`type-pill type-${getEnglishType(m.type)} m-type`}>{m.type}</span>
                                  <span className="m-stat">{m.power}</span>
                                  <span className="m-stat">{m.pp}</span>
                                </div>
                              ))
                            )}

                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row-section section-stats">
                  <div className="nature-picker">
                    <label>Naturaleza:</label>
                    <select className="tb-input" value={slot.nature} onChange={(e) => { const newTeam = [...team]; newTeam[index].nature = e.target.value; setTeam(newTeam); }}>
                      {Object.keys(NATURES).map(nat => (
                        <option key={nat} value={nat}>{formatNature(nat)}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="stats-evs-single-col">
                    {Object.keys(STAT_LABELS).map(stat => {
                      const barInfo = getStatBarInfo(slot, stat);
                      const totalStat = calculateTotalStat(slot.pokemon.baseStats?.[stat] || 0, slot.evs[stat], stat, slot.nature);
                      
                      return (
                        <div key={stat} className="stat-ev-row">
                          <span className="stat-label">
                            {STAT_LABELS[stat]} <span style={{color: barInfo.color, fontWeight: '900'}}>{barInfo.modifier}</span>
                          </span>
                          
                          <div className="stat-bar-bg">
                            <div className="stat-bar-fill" style={{ width: barInfo.width, background: barInfo.color }}></div>
                          </div>
                          
                          <span className="stat-total">{totalStat}</span>

                          <div className="ev-input-container">
                            <span className="ev-prefix">EVs</span>
                            <input type="number" className="tb-input ev-input" value={slot.evs[stat]} min="0" max="32" onChange={(e) => {
                              const newTeam = [...team]; 
                              const val = Math.min(32, Math.max(0, parseInt(e.target.value) || 0));
                              const other = Object.keys(newTeam[index].evs).filter(s => s !== stat).reduce((sum, s) => sum + newTeam[index].evs[s], 0);
                              
                              newTeam[index].evs[stat] = other + val > 66 ? 66 - other : val; 
                              setTeam(newTeam);
                            }} />
                          </div>
                          
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-evs">EVs Disp: {66 - Object.values(slot.evs).reduce((a, b) => a + b, 0)}</div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {searchModal.isOpen && (
        <div className="tb-modal-overlay" onClick={closeSearch}>
          <div className="tb-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="tb-modal-header">
              <h3>Buscando Pokémon...</h3>
              <button className="close-modal-btn" onClick={closeSearch}>✕</button>
            </div>
            <input type="text" className="tb-search-input-modal" placeholder="Mín 3 letras..." value={searchQuery} onChange={handleSearch} autoFocus />
            
            <div className="tb-modal-results">
              {searchResults.length === 0 && searchQuery.length >= 3 && <p className="no-results-text">Buscando o sin resultados...</p>}
              {searchResults.map(p => (
                <div key={p.pokedexId || p.id || Math.random()} className="tb-modal-result-item" onClick={() => selectPokemon(p)}>
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
};

export default TeamBuilder;