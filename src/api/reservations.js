import client from './client';

const RESERVATION_BASE = '/api/flight/reservations';

const userHeaders = (userId) => (
  userId
    ? {
        'X-User-Id': userId,
      }
    : {}
);

export const getReservations = (userId) => client.get(RESERVATION_BASE, {
  headers: userHeaders(userId),
});

export const getReservation = (id, userId) => client.get(`${RESERVATION_BASE}/${id}`, {
  headers: userHeaders(userId),
});

export const cancelReservation = (id, userId) => client.patch(
  `${RESERVATION_BASE}/${id}/cancel`,
  {},
  { headers: userHeaders(userId) }
);
