import client from './client';

export const getReservations = () => client.get('/reservations');

export const getReservation = (id) => client.get(`/reservations/${id}`);
