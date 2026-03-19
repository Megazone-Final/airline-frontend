import client from './client';

// 결제 시 승객 정보 + 항공편 ID를 함께 전송 → 예약 자동 생성
export const createPayment = (data) => client.post('/payment', data);

export const getPaymentStatus = (id) => client.get(`/payment/${id}`);

export const getPayments = () => client.get('/payment');
