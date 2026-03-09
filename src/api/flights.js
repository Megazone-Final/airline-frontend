import client from './client';

export const searchFlights = (params) => client.get('/flights', { params });

export const getFlightDetail = (id) => client.get(`/flights/${id}`);
