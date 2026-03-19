import client from './client';

const FLIGHT_BASE = '/api/flight';

export const searchFlights = (params) => client.get(FLIGHT_BASE, { params });

export const getFlightDetail = (id) => client.get(`${FLIGHT_BASE}/${id}`);
