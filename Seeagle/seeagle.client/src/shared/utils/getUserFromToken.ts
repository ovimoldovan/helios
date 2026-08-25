import { jwtDecode } from "jwt-decode";

interface UserPayload {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    exp: number;
    role?: string;
}

export function getUserFromToken(): UserPayload | null {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('authToken='))
            ?.split('=')[1];

        if (!token) return null;

        const decoded = jwtDecode<any>(token);
        console.log('Decoded token:', decoded);

        return {
            sub: decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
            email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
            given_name: decoded.given_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || '',
            family_name: decoded.family_name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || '',
            exp: decoded.exp || 0,
            role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || ''
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}