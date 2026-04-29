import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlightDetail } from '../api/flights';
import { cancelReservation } from '../api/reservations';
import {
    cancelReservationPayment,
    getPaymentStatus,
    getPayments,
    getReservationHistory,
} from '../api/payment';
import { normalizeFlightBrand, normalizeFlightNo } from '../utils/brand';
import './MyPage.css';

export default function MyPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('reservations');
    const [reservations, setReservations] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [cancelingId, setCancelingId] = useState('');

    const reservationMap = useMemo(
        () => new Map(reservations.map((reservation) => [reservation.id, reservation])),
        [reservations]
    );

    const matchedPayments = useMemo(
        () => payments.filter((payment) => payment.reservationId && reservationMap.has(payment.reservationId)),
        [payments, reservationMap]
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const res = await getReservationHistory();
            const nextReservations = Array.isArray(res.data?.reservations)
                ? res.data.reservations.map((reservation) => ({
                    ...reservation,
                    flightNo: normalizeFlightNo(reservation.flightNo),
                }))
                : [];
            const nextPayments = Array.isArray(res.data?.payments) ? res.data.payments : [];

            setReservations(nextReservations);
            setPayments(nextPayments);
        } catch (err) {
            try {
                const fallback = await loadPaymentBackedHistory();
                setReservations(fallback.reservations);
                setPayments(fallback.payments);
            } catch (fallbackErr) {
                setReservations([]);
                setPayments([]);
                setLoadError(fallbackErr.response?.data?.message || err.response?.data?.message || '예약 및 결제 내역을 불러오지 못했습니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentBackedHistory = async () => {
        const payRes = await getPayments();
        const basePayments = Array.isArray(payRes.data)
            ? payRes.data.filter((payment) => (
                payment.reservationId && ['completed', 'cancelled'].includes(payment.status)
            ))
            : [];
        const detailedPayments = await Promise.all(
            basePayments.map(async (payment) => {
                try {
                    const detailRes = await getPaymentStatus(payment.id);
                    return { ...payment, ...detailRes.data };
                } catch {
                    return payment;
                }
            })
        );
        const nextReservations = await Promise.all(
            detailedPayments.map(async (payment) => {
                let flight = null;
                if (payment.flightId) {
                    try {
                        const flightRes = await getFlightDetail(payment.flightId);
                        flight = normalizeFlightBrand(flightRes.data);
                    } catch {
                        flight = null;
                    }
                }

                return {
                    id: payment.reservationId,
                    flightNo: normalizeFlightNo(flight?.flightNo) || '-',
                    departure: flight?.departure || '-',
                    arrival: flight?.arrival || '-',
                    date: payment.travelDate || '-',
                    departureTime: flight?.departureTime || '-',
                    status: payment.status === 'cancelled' ? 'cancelled' : 'confirmed',
                    passengerCount: payment.passengerCount || 1,
                    totalPrice: payment.amount || 0,
                    createdAt: payment.createdAt,
                    payment,
                };
            })
        );

        return {
            reservations: nextReservations,
            payments: detailedPayments,
        };
    };

    const statusLabel = (status) => {
        const map = { confirmed: '확정', pending: '대기', cancelled: '취소', completed: '완료', failed: '실패' };
        return map[status] || status;
    };

    const statusClass = (status) => {
        const map = { confirmed: 'status-confirmed', pending: 'status-pending', cancelled: 'status-cancelled', completed: 'status-completed', failed: 'status-cancelled' };
        return map[status] || '';
    };

    const canCancel = (reservation) => !['cancelled'].includes(reservation.status);

    const handleCancelReservation = async (reservation) => {
        const confirmed = window.confirm(`${reservation.departure} → ${reservation.arrival} 예약을 취소할까요?`);
        if (!confirmed) {
            return;
        }

        setCancelingId(reservation.id);
        setActionError('');

        try {
            try {
                await cancelReservationPayment(reservation.id);
            } catch (paymentCancelErr) {
                await cancelReservation(reservation.id);
            }
            await loadData();
        } catch (err) {
            setActionError(err.response?.data?.message || '예약 취소에 실패했습니다.');
        } finally {
            setCancelingId('');
        }
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

                {(loadError || actionError) && (
                    <div className="mypage-alert">
                        <span>{loadError || actionError}</span>
                        {loadError && (
                            <button type="button" onClick={loadData}>
                                다시 시도
                            </button>
                        )}
                    </div>
                )}

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
                                                {canCancel(r) && (
                                                    <button
                                                        type="button"
                                                        className="res-cancel-btn"
                                                        onClick={() => handleCancelReservation(r)}
                                                        disabled={cancelingId === r.id}
                                                    >
                                                        {cancelingId === r.id ? '취소 중...' : '예약 취소'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Payments */}
                        {tab === 'payments' && (
                            <div className="payment-list">
                                {matchedPayments.length === 0 ? (
                                    <div className="empty-state">
                                        <span className="empty-icon">—</span>
                                        <h3>결제 내역이 없습니다</h3>
                                    </div>
                                ) : (
                                    matchedPayments.map((p) => {
                                        const reservation = reservationMap.get(p.reservationId);

                                        return (
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
                                                    <span className="ph-label">노선</span>
                                                    <span>{reservation.departure} → {reservation.arrival}</span>
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
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
