import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../css/Auth.css';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ identifier: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login({ identifier: form.identifier, password: form.password });
      } else {
        await register({ username: form.username, email: form.email, password: form.password });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Algo salió mal. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Cabecera con pokeball */}
        <div className="auth-header">
          <svg className="auth-pokeball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 a45 45 0 0 1 44.5 38.5 h-31.1 a15 15 0 0 0 -26.8 0 h-31.1 a45 45 0 0 1 44.5 -38.5 z" fill="#e3350d" stroke="#212121" strokeWidth="5" />
            <path d="M50 95 a45 45 0 0 0 44.5 -38.5 h-31.1 a15 15 0 0 1 -26.8 0 h-31.1 a45 45 0 0 0 44.5 38.5 z" fill="#ffffff" stroke="#212121" strokeWidth="5" />
            <circle cx="50" cy="50" r="14" fill="#ffffff" stroke="#212121" strokeWidth="5" />
            <circle cx="50" cy="50" r="6" fill="#212121" />
            <line x1="5" y1="50" x2="36" y2="50" stroke="#212121" strokeWidth="5" />
            <line x1="64" y1="50" x2="95" y2="50" stroke="#212121" strokeWidth="5" />
          </svg>
          <h1>{mode === 'login' ? 'Bienvenido de nuevo' : 'Únete a PokéApp'}</h1>
          <p>{mode === 'login' ? 'Inicia sesión para gestionar tus equipos' : 'Crea tu cuenta para guardar tus equipos'}</p>
        </div>

        {/* Pestañas */}
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchMode('login')} type="button">
            Iniciar sesión
          </button>
          <button className={mode === 'register' ? 'auth-tab active' : 'auth-tab'} onClick={() => switchMode('register')} type="button">
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'login' ? (
            <div className="auth-field">
              <label>Usuario o email</label>
              <input name="identifier" value={form.identifier} onChange={handleChange} placeholder="ash_ketchum o ash@pueblopaleta.com" required />
            </div>
          ) : (
            <>
              <div className="auth-field">
                <label>Nombre de usuario</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="ash_ketchum" minLength={3} maxLength={20} required />
              </div>
              <div className="auth-field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ash@pueblopaleta.com" required />
              </div>
            </>
          )}

          <div className="auth-field">
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" minLength={6} required />
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Procesando...' : (mode === 'login' ? 'Entrar' : 'Crear cuenta')}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === 'login' ? (
            <>¿No tienes cuenta? <button type="button" className="auth-link" onClick={() => switchMode('register')}>Regístrate</button></>
          ) : (
            <>¿Ya tienes cuenta? <button type="button" className="auth-link" onClick={() => switchMode('login')}>Inicia sesión</button></>
          )}
        </p>

        <Link to="/" className="auth-guest-link">← Seguir como invitado</Link>
      </div>

      {submitting && <Loader fullscreen text={mode === 'login' ? 'Entrando...' : 'Creando cuenta...'} />}
    </div>
  );
}
