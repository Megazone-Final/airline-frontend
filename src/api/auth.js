import client from './client';

const AUTH_BASE = '/api/auth/users';

export const register = (data) => client.post(`${AUTH_BASE}/register`, data);

export const login = (data) => client.post(`${AUTH_BASE}/login`, data);

export const getProfile = () => client.get(`${AUTH_BASE}/profile`);

export const logout = () => client.post(`${AUTH_BASE}/logout`);
