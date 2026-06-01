// Tabla de efectividad de tipos (tipos en inglés, igual que la BD).
// Solo se listan los multiplicadores distintos de 1.
export const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Multiplicador total contra uno o varios tipos defensores.
export function getEffectiveness(moveType, defenderTypes = []) {
  const chart = TYPE_CHART[moveType] || {};
  return defenderTypes.reduce((mult, t) => mult * (chart[t] ?? 1), 1);
}

// Etiqueta legible para el multiplicador de efectividad.
export function effectivenessLabel(mult) {
  if (mult === 0) return { text: 'Sin efecto', color: '#64748b' };
  if (mult >= 4) return { text: `Súper eficaz ×${mult}`, color: '#16a34a' };
  if (mult > 1) return { text: `Súper eficaz ×${mult}`, color: '#16a34a' };
  if (mult < 1) return { text: `Poco eficaz ×${mult}`, color: '#dc2626' };
  return { text: 'Daño normal ×1', color: '#64748b' };
}

// Traducción de tipos inglés -> español para mostrar.
export const TYPE_ES = {
  normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta', electric: 'Eléctrico', ice: 'Hielo',
  fighting: 'Lucha', poison: 'Veneno', ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
  rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro', steel: 'Acero', fairy: 'Hada'
};

export const API_TYPE_TO_ES = TYPE_ES; // alias

// Cálculo de una estadística a un nivel dado (IV 31, EV 0, naturaleza neutra).
export function calcStat(base, level, isHP = false) {
  if (isHP) return Math.floor(((2 * base + 31) * level) / 100) + level + 10;
  return Math.floor(((2 * base + 31) * level) / 100) + 5;
}

/**
 * Fórmula de daño de Pokémon (Gen 3+).
 * Devuelve { min, max } de daño.
 */
export function calcDamage({ level, power, attack, defense, stab, typeEff, critical }) {
  if (!power || typeEff === 0) return { min: 0, max: 0 };
  const levelFactor = Math.floor((2 * level) / 5) + 2;
  const base = Math.floor(Math.floor((levelFactor * power * attack) / defense) / 50) + 2;
  const modifier = stab * typeEff * (critical ? 1.5 : 1);
  return {
    min: Math.floor(base * modifier * 0.85),
    max: Math.floor(base * modifier * 1.0)
  };
}
