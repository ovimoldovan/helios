export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'User' | 'Admin' | 'Moderator';
}

export interface LoginErrorResponse {
    message: string;
    status: number;
}