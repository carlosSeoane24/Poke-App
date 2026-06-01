import api from './api';

export const getMyTeams = async () => {
  const { data } = await api.get('/teams');
  return data;
};

export const getTeam = async (id) => {
  const { data } = await api.get(`/teams/${id}`);
  return data;
};

export const createTeam = async ({ name, slots }) => {
  const { data } = await api.post('/teams', { name, slots });
  return data;
};

export const updateTeam = async (id, { name, slots }) => {
  const { data } = await api.put(`/teams/${id}`, { name, slots });
  return data;
};

export const deleteTeam = async (id) => {
  const { data } = await api.delete(`/teams/${id}`);
  return data;
};
