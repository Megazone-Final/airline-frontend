import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayment } from '../api/payment';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [date, setDate] = useState('');

    // [추가] 결제 테스트 API 호출 함수
    const handlePaymentTest = async () => {
        try {
            const response = await createPayment({
                flightId: 10,
                date: '2026-03-25',
                passengers: [{ firstName: '홍길동', lastName: '홍', birth: '1990-01-01', gender: 'M', passport: 'M12345678', nationality: 'KR' }],
                totalAmount: 75000,
            });

            if (response && response.data) {
                alert('✅ 결제 데이터가 RDS에 성공적으로 삽입되었습니다!');
                console.log('Success:', response.data);
            } else {
                throw new Error('결제 실패');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ 결제 실패 (로그 확인 필요)');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (departure) params.set('departure', departure);
        if (arrival) params.set('arrival', arrival);
        if (date) params.set('date', date);
        navigate(`/flights?${params.toString()}`);
    };

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="hero-title">
                        새로운 하늘길,<br />
                        SkyWing과 함께 떠나세요
                    </h1>
                    <p className="hero-sub">국내·국제 항공권 검색 및 예약</p>
                </div>
            </section>

            <section className="search-section container">
                <form className="home-search" onSubmit={handleSearch}>
                    <div className="hs-field">
                        <label>출발지</label>
                        <input
                            type="text"
                            placeholder="도시 또는 공항코드"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                        />
                    </div>
                    <div className="hs-swap" onClick={() => { setDeparture(arrival); setArrival(departure); }}>
                        ⇄
                    </div>
                    <div className="hs-field">
                        <label>도착지</label>
                        <input
                            type="text"
                            placeholder="도시 또는 공항코드"
                            value={arrival}
                            onChange={(e) => setArrival(e.target.value)}
                        />
                    </div>
                    <div className="hs-field">
                        <label>가는 날</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg hs-btn">
                        항공편 검색
                    </button>
                </form>
            </section>

            {/* Quick Links - 여기에 버튼 UI가 추가됩니다 */}
            <section className="quick-links container">
                <div className="ql-grid">
                    <div className="ql-card" onClick={() => navigate('/flights')}>
                        <div className="ql-icon-wrap">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                        </div>
                        <h3>항공편 조회</h3>
                        <p>출발지, 도착지, 날짜로 항공편을 검색하세요</p>
                    </div>

                    {/* [새로 추가된 버튼 카드] */}
                    <div className="ql-card" onClick={handlePaymentTest} style={{ cursor: 'pointer', border: '2px solid #007bff' }}>
                        <div className="ql-icon-wrap">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="1.5">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                                <path d="M16 14l2 2 4-4" />
                            </svg>
                        </div>
                        <h3 style={{ color: '#007bff' }}>결제 테스트</h3>
                        <p>클릭 시 RDS Proxy를 통해 데이터를 삽입합니다</p>
                    </div>

                    <div className="ql-card" onClick={() => navigate('/mypage')}>
                        <div className="ql-icon-wrap">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                <rect x="9" y="3" width="6" height="4" rx="1" />
                                <path d="M9 14l2 2 4-4" />
                            </svg>
                        </div>
                        <h3>예약 확인</h3>
                        <p>예약 내역과 결제 상태를 확인하세요</p>
                    </div>
                </div>
            </section>

            <section className="popular-section">
                <div className="container">
                    <h2 className="section-title">인기 노선</h2>
                    <div className="routes-grid">
                        {[
                            { from: '인천 ICN', to: '도쿄 NRT', price: '200,000' },
                            { from: '인천 ICN', to: '오사카 KIX', price: '180,000' },
                            { from: '인천 ICN', to: '방콕 BKK', price: '285,000' },
                            { from: '김포 GMP', to: '제주 CJU', price: '200,000' },
                        ].map((route, i) => (
                            <div key={i} className="route-card" onClick={() => navigate('/flights')}>
                                <div className="route-cities">
                                    <span className="route-from">{route.from}</span>
                                    <span className="route-arrow">→</span>
                                    <span className="route-to">{route.to}</span>
                                </div>
                                <div className="route-price">
                                    <span className="price-label">편도 최저</span>
                                    <span className="price-value">₩{route.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
