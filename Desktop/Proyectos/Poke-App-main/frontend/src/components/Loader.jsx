import './Loader.css';

/**
 * Loader temático: una Pokéball que se balancea (como cuando capturas un Pokémon).
 * Props:
 *  - text:       mensaje opcional bajo la pokeball
 *  - fullscreen: si es true ocupa toda la pantalla con overlay
 *  - size:       tamaño en px de la pokeball (por defecto 64)
 */
export default function Loader({ text = 'Cargando...', fullscreen = false, size = 64 }) {
  return (
    <div className={fullscreen ? 'loader-overlay' : 'loader-inline'}>
      <div className="loader-content">
        <svg
          className="loader-pokeball"
          width={size}
          height={size}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Mitad superior roja */}
          <path d="M50 5 a45 45 0 0 1 44.5 38.5 h-31.1 a15 15 0 0 0 -26.8 0 h-31.1 a45 45 0 0 1 44.5 -38.5 z" fill="#e3350d" stroke="#212121" strokeWidth="5" />
          {/* Mitad inferior blanca */}
          <path d="M50 95 a45 45 0 0 0 44.5 -38.5 h-31.1 a15 15 0 0 1 -26.8 0 h-31.1 a45 45 0 0 0 44.5 38.5 z" fill="#ffffff" stroke="#212121" strokeWidth="5" />
          {/* Círculo central exterior */}
          <circle cx="50" cy="50" r="14" fill="#ffffff" stroke="#212121" strokeWidth="5" />
          {/* Botón central interior */}
          <circle className="loader-pokeball-button" cx="50" cy="50" r="6" fill="#212121" />
          {/* Línea divisoria central */}
          <line x1="5" y1="50" x2="36" y2="50" stroke="#212121" strokeWidth="5" />
          <line x1="64" y1="50" x2="95" y2="50" stroke="#212121" strokeWidth="5" />
        </svg>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );
}
