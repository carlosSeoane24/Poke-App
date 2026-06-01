import axios from 'axios';

// Ahora apuntamos a TU servidor local
const API_URL = 'http://localhost:5000/api';

// Le pasamos un objeto con los filtros que queramos aplicar
export const getPokemonList = async (filters = {}) => {
  try {
    // Axios convierte el objeto filters en parámetros de URL
    // Ejemplo: /api/pokemon?sortBy=stats.attack&order=desc
    const response = await axios.get(`${API_URL}/pokemon`, { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching from our DB", error);
    return [];
  }
};