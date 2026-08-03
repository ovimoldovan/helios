import { jwtDecode } from "jwt-decode";

interface UserPayload {
    sub: string;
    email: string;
    given_name: string;
    family_name: string;
    exp: number;
}

export function getUserFromToken(): UserPayload | null {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

    if (!token) return null;

    try {
        return jwtDecode<UserPayload>(token);
    } catch {
        return null;
    }
}