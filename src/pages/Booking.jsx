import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { status, isAuthenticated } = useAuth();

    const flight = location.state?.flight || null;

    const passengerCount = location.state?.passengers || 1;
    const date = location.state?.date || new Date().toISOString().split('T')[0];

    const [passengers, setPassengers] = useState(
        Array.from({ length: passengerCount }, () => ({
            lastName: '',
            firstName: '',
            birth: '',
            gender: 'M',
            passport: '',
            nationality: 'KR',
        }))
    );

    const [errors, setErrors] = useState({});

    if (!flight) {
        return (
            <div className="page booking">
                <div className="container">
                    <div className="page-header">
                        <h1>항공편 정보가 없습니다</h1>
                        <p>검색 결과에서 항공편을 다시 선택해주세요.</p>
                    </div>
                    <div className="booking-empty animate-fade-in">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/flights')}>
                            항공편 검색하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const updatePassenger = (idx, field, value) => {
        setPassengers((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], [field]: value };
            return next;
        });
    };

    const validate = () => {
        const newErrors = {};
        passengers.forEach((p, i) => {
            if (!p.lastName.trim()) newErrors[`${i}-lastName`] = '성을 입력하세요';
            if (!p.firstName.trim()) newErrors[`${i}-firstName`] = '이름을 입력하세요';
            if (!p.birth) newErrors[`${i}-birth`] = '생년월일을 입력하세요';
            if (!p.passport.trim()) newErrors[`${i}-passport`] = '여권번호를 입력하세요';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceedPayment = () => {
        if (!validate()) return;

        const paymentState = { flight, passengers, date };

        if (status !== 'checking' && !isAuthenticated) {
            navigate('/login', {
                state: {
                    from: {
                        pathname: '/payment',
                        state: paymentState,
                    },
                },
            });
            return;
        }

        navigate('/payment', {
            state: paymentState,
        });
    };

    return (
        <div className="page booking">
            <div className="container">
                <div className="page-header">
                    <h1>승객 정보 입력</h1>
                    <p>탑승자 정보를 정확하게 입력해주세요</p>
                </div>

                {/* Flight Summary */}
                <div className="booking-flight-summary animate-fade-in">
                    <div className="summary-badge">선택한 항공편</div>
                    <div className="summary-content">
                        <div className="summary-airline">
                            <span className="airline-icon">MZC</span>
                            <div>
                                <strong>{flight.airline}</strong>
                                <span>{flight.flightNo}</span>
                            </div>
                        </div>
                        <div className="summary-route">
                            <div className="summary-point">
                                <span className="s-time">{flight.departureTime}</span>
                                <span className="s-code">{flight.departure}</span>
                            </div>
                            <div className="summary-line">
                                <span>{flight.duration}</span>
                                <div className="s-line-bar"></div>
                            </div>
                            <div className="summary-point">
                                <span className="s-time">{flight.arrivalTime}</span>
                                <span className="s-code">{flight.arrival}</span>
                            </div>
                        </div>
                        <div className="summary-meta">
                            <span>{date}</span>
                            <span>{passengerCount}명</span>
                        </div>
                    </div>
                </div>

                {/* Passenger Forms */}
                <div className="passenger-forms">
                    {passengers.map((p, idx) => (
                        <div key={idx} className="passenger-card card animate-slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <h3 className="passenger-title">
                                <span className="passenger-num">{idx + 1}</span>
                                탑승자 {idx + 1}
                            </h3>
                            <div className="passenger-grid">
                                <div className="form-group">
                                    <label className="form-label">성 (Last Name)</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors[`${idx}-lastName`] ? 'input-error' : ''}`}
                                        placeholder="HONG"
                                        value={p.lastName}
                                        onChange={(e) => updatePassenger(idx, 'lastName', e.target.value)}
                                    />
                                    {errors[`${idx}-lastName`] && <span className="form-error">{errors[`${idx}-lastName`]}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">이름 (First Name)</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors[`${idx}-firstName`] ? 'input-error' : ''}`}
                                        placeholder="GILDONG"
                                        value={p.firstName}
                                        onChange={(e) => updatePassenger(idx, 'firstName', e.target.value)}
                                    />
                                    {errors[`${idx}-firstName`] && <span className="form-error">{errors[`${idx}-firstName`]}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">생년월일</label>
                                    <input
                                        type="date"
                                        className={`form-input ${errors[`${idx}-birth`] ? 'input-error' : ''}`}
                                        value={p.birth}
                                        onChange={(e) => updatePassenger(idx, 'birth', e.target.value)}
                                    />
                                    {errors[`${idx}-birth`] && <span className="form-error">{errors[`${idx}-birth`]}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">성별</label>
                                    <select
                                        className="form-input"
                                        value={p.gender}
                                        onChange={(e) => updatePassenger(idx, 'gender', e.target.value)}
                                    >
                                        <option value="M">남성</option>
                                        <option value="F">여성</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">여권번호</label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors[`${idx}-passport`] ? 'input-error' : ''}`}
                                        placeholder="M12345678"
                                        value={p.passport}
                                        onChange={(e) => updatePassenger(idx, 'passport', e.target.value)}
                                    />
                                    {errors[`${idx}-passport`] && <span className="form-error">{errors[`${idx}-passport`]}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">국적</label>
                                    <select
                                        className="form-input"
                                        value={p.nationality}
                                        onChange={(e) => updatePassenger(idx, 'nationality', e.target.value)}
                                    >
                                        <option value="KR">대한민국</option>
                                        <option value="US">미국</option>
                                        <option value="JP">일본</option>
                                        <option value="CN">중국</option>
                                        <option value="OTHER">기타</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price Summary & Proceed */}
                <div className="booking-bottom">
                    <div className="booking-total">
                        <div className="total-breakdown">
                            <span>항공 운임 × {passengerCount}명</span>
                            <span>₩{(flight.price * passengerCount).toLocaleString()}</span>
                        </div>
                        <div className="total-breakdown">
                            <span>유류할증료</span>
                            <span>₩{(28000 * passengerCount).toLocaleString()}</span>
                        </div>
                        <div className="total-breakdown">
                            <span>공항이용료</span>
                            <span>₩{(17000 * passengerCount).toLocaleString()}</span>
                        </div>
                        <div className="total-line"></div>
                        <div className="total-final">
                            <span>총 결제 금액</span>
                            <span className="total-price">₩{((flight.price + 28000 + 17000) * passengerCount).toLocaleString()}</span>
                        </div>
                    </div>
                    <button className="btn btn-accent btn-lg" onClick={handleProceedPayment}>
                        결제하기 →
                    </button>
                </div>
            </div>
        </div>
    );
}
