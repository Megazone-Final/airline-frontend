import client from './client';

const RESERVATION_BASE = '/api/flight/reservations';

export const getReservations = () => client.get(RESERVATION_BASE);

export const getReservation = (id) => client.get(`${RESERVATION_BASE}/${id}`);

export const cancelReservation = (id) => client.patch(`${RESERVATION_BASE}/${id}/cancel`);
