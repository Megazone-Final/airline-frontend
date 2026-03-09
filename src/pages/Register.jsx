import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import './Auth.css';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const update = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = '이름을 입력하세요';
        if (!form.email.trim()) e.email = '이메일을 입력하세요';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = '올바른 이메일 형식이 아닙니다';
        if (!form.password) e.password = '비밀번호를 입력하세요';
        else if (form.password.length < 8) e.password = '비밀번호는 8자 이상이어야 합니다';
        if (form.password !== form.passwordConfirm) e.passwordConfirm = '비밀번호가 일치하지 않습니다';
        if (!form.phone.trim()) e.phone = '전화번호를 입력하세요';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setServerError('');
        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password,
                phone: form.phone,
            });
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            setServerError(err.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
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
                            <h1>회원가입</h1>
                            <p>SkyWing Airlines의 회원이 되어보세요</p>
                        </div>

                        {serverError && <div className="auth-error-banner">{serverError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">이름</label>
                                <input
                                    type="text"
                                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                                    placeholder="홍길동"
                                    value={form.name}
                                    onChange={(e) => update('name', e.target.value)}
                                />
                                {errors.name && <span className="form-error">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">이메일</label>
                                <input
                                    type="email"
                                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                                    placeholder="example@email.com"
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                />
                                {errors.email && <span className="form-error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                    placeholder="8자 이상"
                                    value={form.password}
                                    onChange={(e) => update('password', e.target.value)}
                                />
                                {errors.password && <span className="form-error">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">비밀번호 확인</label>
                                <input
                                    type="password"
                                    className={`form-input ${errors.passwordConfirm ? 'input-error' : ''}`}
                                    placeholder="비밀번호를 다시 입력"
                                    value={form.passwordConfirm}
                                    onChange={(e) => update('passwordConfirm', e.target.value)}
                                />
                                {errors.passwordConfirm && <span className="form-error">{errors.passwordConfirm}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">전화번호</label>
                                <input
                                    type="tel"
                                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                    placeholder="010-1234-5678"
                                    value={form.phone}
                                    onChange={(e) => update('phone', e.target.value)}
                                />
                                {errors.phone && <span className="form-error">{errors.phone}</span>}
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                                {loading ? '처리 중...' : '회원가입'}
                            </button>
                        </form>

                        <p className="auth-footer-text">
                            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
