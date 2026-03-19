import client from './client';

export const register = (data) => client.post('/auth/users/register', data);

export const login = (data) => client.post('/auth/users/login', data);

export const getProfile = () => client.get('/auth/users/profile');

export const logout = () => client.post('/auth/users/logout');
