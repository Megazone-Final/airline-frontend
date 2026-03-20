import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { status, isAuthenticated } = useAuth();

    if (status === 'checking') {
        return (
            <div className="page auth-page">
                <div className="container">
                    <div className="auth-wrapper animate-fade-in">
                        <div className="auth-card">
                            <div className="auth-header">
                                <h1>인증 확인 중</h1>
                                <p>로그인 상태를 확인하고 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
