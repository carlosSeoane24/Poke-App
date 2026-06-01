import api from './api';

export const registerUser = async ({ username, email, password }) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data; // { token, user }
};

export const loginUser = async ({ identifier, password }) => {
  const { data } = await api.post('/auth/login', { identifier, password });
  return data; // { token, user }
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};
