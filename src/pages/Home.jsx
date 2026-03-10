import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [date, setDate] = useState('');

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
            {/* Hero */}
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

            {/* Search Bar */}
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

            {/* Quick Links */}
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
                    <div className="ql-card" onClick={() => navigate('/register')}>
                        <div className="ql-icon-wrap">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                        <h3>회원가입</h3>
                        <p>SkyWing 회원이 되어 더 많은 혜택을 누리세요</p>
                    </div>
                </div>
            </section>

            {/* Popular Routes */}
            <section className="popular-section">
                <div className="container">
                    <h2 className="section-title">인기 노선</h2>
                    <div className="routes-grid">
                        {[
                            { from: '인천 ICN', to: '도쿄 NRT', price: '200,000' },
                            { from: '인천 ICN', to: '오사카 KIX', price: '180,000' },
                            { from: '인천 ICN', to: '방콕 BKK', price: '285,000' },
                            { from: '김포 GMP', to: '제주 CJU', price: '68,000' },
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
