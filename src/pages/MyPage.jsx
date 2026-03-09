import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservations } from '../api/reservations';
import { getPayments } from '../api/payments';
import './MyPage.css';

// Demo data
const DEMO_RESERVATIONS = [
    { id: 'SW-R001', flightNo: 'SW101', departure: 'ICN', arrival: 'NRT', date: '2026-04-15', departureTime: '08:30', status: 'confirmed', passengerCount: 1, totalPrice: 234000 },
    { id: 'SW-R002', flightNo: 'SW410', departure: 'ICN', arrival: 'BKK', date: '2026-05-20', departureTime: '10:20', status: 'confirmed', passengerCount: 2, totalPrice: 660000 },
];

const DEMO_PAYMENTS = [
    { id: 'PAY-001', reservationId: 'SW-R001', amount: 234000, method: 'VISA ****1234', createdAt: '2026-03-09T10:30:00', status: 'completed' },
    { id: 'PAY-002', reservationId: 'SW-R002', amount: 660000, method: 'MASTER ****5678', createdAt: '2026-03-09T11:00:00', status: 'completed' },
];

export default function MyPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resRes, payRes] = await Promise.all([getReservations(), getPayments()]);
            setReservations(resRes.data);
            setPayments(payRes.data);
        } catch {
            setReservations(DEMO_RESERVATIONS);
            setPayments(DEMO_PAYMENTS);
        } finally {
            setLoading(false);
        }
    };

    const statusLabel = (status) => {
        const map = { confirmed: '확정', pending: '대기', cancelled: '취소', completed: '완료' };
        return map[status] || status;
    };

    const statusClass = (status) => {
        const map = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed' };
        return map[status] || '';
    };

    return (
        <div className="page mypage">
            <div className="container">
                <div className="page-header">
                    <h1>마이페이지</h1>
                    <p>예약 및 결제 내역을 확인하세요</p>
                </div>

                {/* Tabs */}
                <div className="mypage-tabs">
                    <button
                        className={`tab-btn ${tab === 'reservations' ? 'active' : ''}`}
                        onClick={() => setTab('reservations')}
                    >
                        예약 내역
                    </button>
                    <button
                        className={`tab-btn ${tab === 'payments' ? 'active' : ''}`}
                        onClick={() => setTab('payments')}
                    >
                        결제 내역
                    </button>
                </div>

                {loading ? (
                    <div className="mypage-loading">
                        <div className="loading-spinner"></div>
                        <p>불러오는 중...</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* Reservations */}
                        {tab === 'reservations' && (
                            <div className="reservation-list">
                                {reservations.length === 0 ? (
                                    <div className="empty-state">
                                        <span className="empty-icon">—</span>
                                        <h3>예약 내역이 없습니다</h3>
                                        <p>첫 번째 항공편을 검색해보세요!</p>
                                        <button className="btn btn-primary" onClick={() => navigate('/flights')}>
                                            항공편 검색
                                        </button>
                                    </div>
                                ) : (
                                    reservations.map((r) => (
                                        <div key={r.id} className="reservation-card card">
                                            <div className="res-header">
                                                <span className="res-id">{r.id}</span>
                                                <span className={`res-status ${statusClass(r.status)}`}>
                                                    {statusLabel(r.status)}
                                                </span>
                                            </div>
                                            <div className="res-body">
                                                <div className="res-route">
                                                    <span className="res-code">{r.departure}</span>
                                                    <span className="res-arrow">→</span>
                                                    <span className="res-code">{r.arrival}</span>
                                                </div>
                                                <div className="res-details">
                                                    <span>{r.date}</span>
                                                    <span>{r.departureTime}</span>
                                                    <span>{r.passengerCount}명</span>
                                                    <span>{r.flightNo}</span>
                                                </div>
                                            </div>
                                            <div className="res-footer">
                                                <span className="res-price">₩{r.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Payments */}
                        {tab === 'payments' && (
                            <div className="payment-list">
                                {payments.length === 0 ? (
                                    <div className="empty-state">
                                        <span className="empty-icon">—</span>
                                        <h3>결제 내역이 없습니다</h3>
                                    </div>
                                ) : (
                                    payments.map((p) => (
                                        <div key={p.id} className="payment-history-card card">
                                            <div className="ph-header">
                                                <span className="ph-id">{p.id}</span>
                                                <span className={`res-status ${statusClass(p.status)}`}>
                                                    {statusLabel(p.status)}
                                                </span>
                                            </div>
                                            <div className="ph-body">
                                                <div className="ph-row">
                                                    <span className="ph-label">예약 번호</span>
                                                    <span>{p.reservationId}</span>
                                                </div>
                                                <div className="ph-row">
                                                    <span className="ph-label">결제 수단</span>
                                                    <span>{p.method}</span>
                                                </div>
                                                <div className="ph-row">
                                                    <span className="ph-label">결제 일시</span>
                                                    <span>{new Date(p.createdAt).toLocaleString('ko-KR')}</span>
                                                </div>
                                            </div>
                                            <div className="ph-footer">
                                                <span className="ph-amount">₩{p.amount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
