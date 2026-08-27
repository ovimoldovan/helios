import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCookie, deleteCookie } from '@/shared/utils/cookies';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = getCookie('authToken');
        setIsAuthenticated(!!token);
        setIsAuthenticated(true);
    }, []);

    function login() {
        setIsAuthenticated(true);
    }
    
    async function logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to notify server logout:', error);
        } finally {
            deleteCookie('authToken');
            setIsAuthenticated(false);
        }
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