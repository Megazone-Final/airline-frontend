import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment } from '../api/payment';
import './Payment.css';

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const flight = location.state?.flight;
    const passengers = location.state?.passengers || [];
    const date = location.state?.date || '';

    const passengerCount = passengers.length || 1;
    const unitPrice = flight?.price || 0;
    const surcharge = 28000;
    const airportFee = 17000;
    const totalPrice = (unitPrice + surcharge + airportFee) * passengerCount;

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [errors, setErrors] = useState({});

    const formatCard = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
        return digits;
    };

    const validate = () => {
        const e = {};
        if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = '카드번호 16자리를 입력하세요';
        if (expiry.length < 5) e.expiry = '유효기간을 입력하세요';
        if (cvc.length < 3) e.cvc = 'CVC를 입력하세요';
        if (!cardName.trim()) e.cardName = '카드 소유자명을 입력하세요';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePayment = async () => {
        if (!validate()) return;
        setProcessing(true);
        try {
            await createPayment({
                flightId: flight?.id,
                passengers,
                date,
                totalAmount: totalPrice,
            });
        } catch {
            // Demo: simulate success even without backend
        }
        // Simulate processing delay
        setTimeout(() => {
            setProcessing(false);
            setCompleted(true);
        }, 2000);
    };

    if (completed) {
        return (
            <div className="page payment">
                <div className="container">
                    <div className="payment-success animate-fade-in">
                        <div className="success-icon">&#10003;</div>
                        <h1>결제 완료!</h1>
                        <p>예약이 성공적으로 확정되었습니다.</p>

                        <div className="success-details card">
                            <div className="success-row">
                                <span>예약 번호</span>
                                <strong>SW-{Date.now().toString(36).toUpperCase()}</strong>
                            </div>
                            <div className="success-row">
                                <span>항공편</span>
                                <strong>{flight?.flightNo} ({flight?.departure} → {flight?.arrival})</strong>
                            </div>
                            <div className="success-row">
                                <span>출발일</span>
                                <strong>{date}</strong>
                            </div>
                            <div className="success-row">
                                <span>승객</span>
                                <strong>{passengerCount}명</strong>
                            </div>
                            <div className="success-row total">
                                <span>결제 금액</span>
                                <strong>₩{totalPrice.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="success-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => navigate('/mypage')}>
                                마이페이지에서 확인
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/')}>
                                홈으로 돌아가기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="page payment">
                <div className="container">
                    <div className="payment-empty animate-fade-in">
                        <h2>항공편 정보가 없습니다</h2>
                        <p>항공편 검색부터 다시 시작해주세요.</p>
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/flights')}>
                            항공편 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page payment">
            <div className="container">
                <div className="page-header">
                    <h1>결제</h1>
                    <p>결제 정보를 입력하고 예약을 확정하세요</p>
                </div>

                <div className="payment-layout">
                    {/* Left: Payment Form */}
                    <div className="payment-form-section">
                        <div className="card payment-card-form animate-fade-in">
                            <h3>카드 정보</h3>

                            <div className="card-preview">
                                <div className="card-chip"></div>
                                <div className="card-number-display">
                                    {cardNumber || '•••• •••• •••• ••••'}
                                </div>
                                <div className="card-bottom">
                                    <div>
                                        <span className="card-label">CARDHOLDER</span>
                                        <span className="card-holder-name">{cardName || 'YOUR NAME'}</span>
                                    </div>
                                    <div>
                                        <span className="card-label">EXPIRES</span>
                                        <span className="card-holder-name">{expiry || 'MM/YY'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">카드 번호</label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.cardNumber ? 'input-error' : ''}`}
                                    placeholder="0000 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCard(e.target.value))}
                                />
                                {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                            </div>

                            <div className="payment-row">
                                <div className="form-group">
                                    <label className="form-label">유효기간</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.expiry ? 'input-error' : ''}`}
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                    />
                                    {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CVC</label>
                                    <input
                                        type="password"
                                        className={`form-input ${errors.cvc ? 'input-error' : ''}`}
                                        placeholder="•••"
                                        maxLength={4}
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                    />
                                    {errors.cvc && <span className="form-error">{errors.cvc}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">카드 소유자명</label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.cardName ? 'input-error' : ''}`}
                                    placeholder="HONG GILDONG"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                />
                                {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="payment-summary-section">
                        <div className="card payment-summary animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            <h3>예약 요약</h3>

                            <div className="summary-flight-info">
                                <div className="sfi-row">
                                    <span className="sfi-label">항공편</span>
                                    <span>{flight.flightNo}</span>
                                </div>
                                <div className="sfi-row">
                                    <span className="sfi-label">노선</span>
                                    <span>{flight.departure} → {flight.arrival}</span>
                                </div>
                                <div className="sfi-row">
                                    <span className="sfi-label">출발</span>
                                    <span>{date} {flight.departureTime}</span>
                                </div>
                                <div className="sfi-row">
                                    <span className="sfi-label">승객</span>
                                    <span>{passengerCount}명</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-prices">
                                <div className="sp-row">
                                    <span>항공 운임 × {passengerCount}</span>
                                    <span>₩{(unitPrice * passengerCount).toLocaleString()}</span>
                                </div>
                                <div className="sp-row">
                                    <span>유류할증료</span>
                                    <span>₩{(surcharge * passengerCount).toLocaleString()}</span>
                                </div>
                                <div className="sp-row">
                                    <span>공항이용료</span>
                                    <span>₩{(airportFee * passengerCount).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-total">
                                <span>총 결제 금액</span>
                                <span className="total-amount">₩{totalPrice.toLocaleString()}</span>
                            </div>

                            <button
                                className="btn btn-accent btn-lg pay-btn"
                                onClick={handlePayment}
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="pay-spinner">처리 중...</span>
                                ) : (
                                    `₩${totalPrice.toLocaleString()} 결제하기`
                                )}
                            </button>

                            <p className="payment-notice">
                                결제 버튼을 클릭하면 이용약관에 동의한 것으로 간주됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
