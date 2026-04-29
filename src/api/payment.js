import client from './client';

const PAYMENT_BASE = '/api/payment';

export const createPayment = (data) => client.post(PAYMENT_BASE, data);

export const getPaymentStatus = (id) => client.get(`${PAYMENT_BASE}/${id}`);

export const getPayments = () => client.get(PAYMENT_BASE);

export const cancelReservationPayment = (reservationId) => (
  client.patch(`${PAYMENT_BASE}/reservations/${reservationId}/cancel`)
);
