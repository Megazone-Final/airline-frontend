import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, logout as requestLogout } from '../api/auth';

const AuthContext = createContext(null);

function readStoredToken() {
    return localStorage.getItem('token');
}

function storeToken(token) {
    localStorage.setItem('token', token);
}

function clearStoredToken() {
    localStorage.removeItem('token');
}

export function AuthProvider({ children }) {
    const [status, setStatus] = useState('checking');
    const [user, setUser] = useState(null);

    const refreshAuth = async () => {
        if (!readStoredToken()) {
            setUser(null);
            setStatus('unauthenticated');
            return false;
        }

        try {
            const response = await getProfile();
            setUser(response.data);
            setStatus('authenticated');
            return true;
        } catch {
            clearStoredToken();
            setUser(null);
            setStatus('unauthenticated');
            return false;
        }
    };

    useEffect(() => {
        refreshAuth();
    }, []);

    const login = ({ token, user: nextUser }) => {
        if (!token || typeof token !== 'string') {
            throw new Error('유효한 인증 토큰이 없습니다');
        }

        storeToken(token);
        setUser(nextUser || null);
        setStatus('authenticated');
    };

    const logout = async () => {
        try {
            if (readStoredToken()) {
                await requestLogout();
            }
        } catch {
            // Ignore logout request failures and clear local auth state.
        } finally {
            clearStoredToken();
            setUser(null);
            setStatus('unauthenticated');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                isAuthenticated: status === 'authenticated',
                login,
                logout,
                refreshAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
