import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCookie, deleteCookie } from '@/shared/utils/cookies';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getCookie('authToken');
        setIsAuthenticated(!!token);
    }, []);

    function login() {
        setIsAuthenticated(true);
    }

    function logout() {
        deleteCookie('authToken');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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