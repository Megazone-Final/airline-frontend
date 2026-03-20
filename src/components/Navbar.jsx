import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { status, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-inner container">
                <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                    <svg className="logo-plane" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                    <span className="logo-text">SKYWING</span>
                    <span className="logo-sub">AIRLINES</span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/flights" className="nav-link" onClick={() => setMenuOpen(false)}>
                        항공편 조회
                    </Link>
                    {isAuthenticated && (
                        <Link to="/mypage" className="nav-link" onClick={() => setMenuOpen(false)}>
                            마이페이지
                        </Link>
                    )}
                    <div className="nav-divider"></div>
                    <div className="nav-auth">
                        {status === 'checking' ? null : isAuthenticated ? (
                            <button className="nav-auth-link" onClick={handleLogout}>로그아웃</button>
                        ) : (
                            <>
                                <Link to="/login" className="nav-auth-link" onClick={() => setMenuOpen(false)}>
                                    로그인
                                </Link>
                                <Link to="/register" className="nav-auth-link" onClick={() => setMenuOpen(false)}>
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <button
                    className={`navbar-hamburger ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="메뉴"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
}
