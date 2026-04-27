import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const registered = location.state?.registered;
    const { login: completeLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = '이메일을 입력하세요';
        if (!password) e.password = '비밀번호를 입력하세요';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError('');
        try {
            const res = await login({ email, password });
            if (!res?.data || typeof res.data !== 'object' || !res.data.token) {
                throw new Error('인증 서버 응답이 올바르지 않습니다');
            }

            completeLogin({
                token: res.data.token,
                user: res.data.user,
            });

            const redirectTarget = location.state?.from;
            const nextPath = redirectTarget?.pathname
                ? `${redirectTarget.pathname}${redirectTarget.search || ''}`
                : '/';
            navigate(nextPath, {
                replace: true,
                state: redirectTarget?.state,
            });
        } catch (err) {
            setServerError(
                err.response?.data?.message ||
                err.message ||
                '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page auth-page">
            <div className="container">
                <div className="auth-wrapper animate-fade-in">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>로그인</h1>
                            <p>MZC에 오신 것을 환영합니다</p>
                        </div>

                        {registered && (
                            <div className="auth-success-banner">
                                회원가입이 완료되었습니다! 로그인해주세요.
                            </div>
                        )}

                        {serverError && <div className="auth-error-banner">{serverError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">이메일</label>
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                                />
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    placeholder="비밀번호 입력"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                                />
                                {errors.password && <span className="form-error">{errors.password}</span>}
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                                {loading ? '로그인 중...' : '로그인'}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            계정이 없으신가요? <Link to="/register">회원가입</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
