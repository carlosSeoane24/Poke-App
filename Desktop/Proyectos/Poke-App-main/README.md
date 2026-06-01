# PokéApp ⚔️

Aplicación web full-stack sobre Pokémon: una **Pokédex** completa, un **Team Builder** competitivo, una **calculadora de daño** y un sistema de **cuentas de usuario** para guardar tus equipos.

La estética sigue la temática clásica de Pokémon (rojo `#e3350d`, pokeball SVG) con un diseño limpio y moderno.

---

## 🧩 ¿En qué consiste?

| Módulo | Descripción |
|--------|-------------|
| **Pokédex** | Catálogo nacional con búsqueda, filtros por tipo, ordenación por estadísticas, paginación y ficha detallada (stats, evoluciones, movimientos). |
| **Team Builder** | Arma equipos de 6 Pokémon con objeto, habilidad, naturaleza, EVs y movimientos. Si inicias sesión puedes **guardar, cargar y borrar** tus equipos. |
| **Calculadora de Daño** | Enfrenta un atacante contra un defensor, elige el movimiento y calcula el rango de daño (fórmula Gen 3+ con STAB, efectividad de tipos y crítico). |
| **Cuentas de usuario** | Registro e inicio de sesión con JWT. Navegar es libre; iniciar sesión solo hace falta para guardar equipos. |
| **Loader temático** | Una pokeball animada que se balancea durante las cargas. |

### 🛠️ Stack tecnológico

- **Frontend:** React 19 + Vite + React Router 7 (`frontend/`)
- **Backend:** Node.js + Express 5 + Mongoose (`backend/`)
- **Base de datos:** MongoDB (vía Docker)
- **Autenticación:** JWT + bcrypt
- **Panel de BD:** Mongo Express (interfaz web para inspeccionar la base de datos)

### 📁 Estructura

```
Poke-App-main/
├── docker-compose.yml      # MongoDB + Mongo Express
├── backend/                # API REST (Express)
│   └── src/
│       ├── index.js        # Servidor y montaje de rutas
│       ├── config.js       # Configuración (puerto, Mongo, JWT)
│       ├── models/         # Pokemon, User, Team
│       ├── routes/         # pokemon, auth, teams
│       ├── middleware/     # auth (verificación JWT)
│       └── seedCompleto.js # Importa los 1025 Pokémon desde PokeAPI
└── frontend/               # Aplicación React
    └── src/
        ├── pages/          # Pokedex, TeamBuilder, DamageCalculator, Login
        ├── components/     # Navbar, Loader, PokemonCard, PokemonModal...
        ├── context/        # AuthContext (sesión)
        ├── services/       # api, authService, teamService, pokemonService
        └── utils/          # typeChart (tabla de tipos y fórmula de daño)
```

---

## 🚀 Cómo se lanza

### Requisitos previos
- [Node.js](https://nodejs.org/) 18 o superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para la base de datos)

> Todos los comandos se ejecutan desde la carpeta `Poke-App-main/` (la que contiene `docker-compose.yml`).

### 1️⃣ Levantar la base de datos
```powershell
docker-compose up -d
```
Esto arranca:
- **MongoDB** en `localhost:27017`
- **Mongo Express** (panel web de la BD) en `http://localhost:8081`

### 2️⃣ Arrancar el backend (API)
```powershell
cd backend
npm install          # solo la primera vez
npm run dev          # servidor en http://localhost:5000
```

### 3️⃣ Poblar la Pokédex (solo la primera vez)
Con la BD y el backend en marcha, importa los Pokémon desde PokeAPI:
```powershell
cd backend
node src/seedCompleto.js
```
> ⚠️ Descarga los 1025 Pokémon; puede tardar varios minutos. Solo hace falta hacerlo una vez (los datos quedan guardados en MongoDB).

### 4️⃣ Arrancar el frontend (web)
```powershell
cd frontend
npm install          # solo la primera vez
npm run dev          # web en http://localhost:5173
```

### ✅ Acceso
- **Aplicación web:** http://localhost:5173
- **API:** http://localhost:5000/api/status
- **Panel de la BD (Mongo Express):** http://localhost:8081

---

## 🛑 Cómo se da de baja

### Parar las aplicaciones (frontend / backend)
Pulsa `Ctrl + C` en cada terminal donde estén corriendo.

### Parar la base de datos
```powershell
docker-compose down
```
Esto detiene y elimina los contenedores, **pero conserva los datos** (quedan guardados en el volumen `mongo_data`).

### Borrar también los datos (reinicio total)
Si quieres eliminar además la base de datos (tendrías que volver a ejecutar el seed):
```powershell
docker-compose down -v
```
El flag `-v` elimina el volumen `mongo_data` con todos los Pokémon, usuarios y equipos guardados.

---

## ⚙️ Configuración (opcional)

El backend usa valores por defecto, pero puedes sobreescribirlos creando un archivo `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://admin:password123@localhost:27017/pokemon_app?authSource=admin
JWT_SECRET=cambia_esto_por_un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
```

> 🔒 En producción es **imprescindible** definir un `JWT_SECRET` propio.

---

## 📡 Endpoints principales de la API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `GET` | `/api/pokemon` | Lista de Pokémon (filtros, búsqueda, paginación) | — |
| `GET` | `/api/pokemon/id/:id` | Pokémon por número de Pokédex | — |
| `POST` | `/api/auth/register` | Registro de usuario | — |
| `POST` | `/api/auth/login` | Inicio de sesión | — |
| `GET` | `/api/auth/me` | Usuario actual | 🔑 |
| `GET` | `/api/teams` | Equipos del usuario | 🔑 |
| `POST` | `/api/teams` | Crear equipo | 🔑 |
| `PUT` | `/api/teams/:id` | Actualizar equipo | 🔑 |
| `DELETE` | `/api/teams/:id` | Borrar equipo | 🔑 |

🔑 = requiere cabecera `Authorization: Bearer <token>`
