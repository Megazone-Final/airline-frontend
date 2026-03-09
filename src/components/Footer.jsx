import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <span className="footer-logo-text">SKYWING</span>
                        <span className="footer-logo-sub">AIRLINES</span>
                    </div>
                    <p className="footer-desc">
                        안전하고 편안한 하늘길,<br />
                        SkyWing Airlines가 함께합니다.
                    </p>
                </div>

                <div className="footer-links-group">
                    <div className="footer-col">
                        <h4>서비스</h4>
                        <Link to="/flights">항공편 조회</Link>
                        <Link to="/mypage">예약 조회</Link>
                    </div>
                    <div className="footer-col">
                        <h4>고객 지원</h4>
                        <Link to="/register">회원가입</Link>
                        <Link to="/login">로그인</Link>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>© 2026 SkyWing Airlines. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
