import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Pokedex from './pages/Pokedex';
import TeamBuilder from './pages/TeamBuilder';
import DamageCalculator from './pages/DamageCalculator';
import Login from './pages/Login';

// 👻 Placeholder para el comparador (aún por construir)
const ComparadorPlaceholder = () => (
  <div className="container content-card" style={{ textAlign: 'center', padding: '4rem' }}>
    <h2>Comparador de Estadísticas 📊</h2>
    <p>¡Próximamente! Aquí podremos enfrentar las stats de dos Pokémon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar /> {/* El Navbar se pone fuera de Routes para que esté en todas las páginas */}
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/calculadora" element={<DamageCalculator />} />
        <Route path="/comparador" element={<ComparadorPlaceholder />} />
        <Route path="/team-builder" element={<TeamBuilder />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
