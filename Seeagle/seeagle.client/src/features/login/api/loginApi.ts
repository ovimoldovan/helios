import type { LoginRequest } from '@/shared/types/authentication';
import { getJson, postJson } from '@/shared/api/httpClient';
import type { AuthUser } from '@/shared/types/authentication';

export async function loginUser(credentials: LoginRequest): Promise<AuthUser> {
    return postJson<AuthUser>('/api/auth/login', credentials);
}

export async function getCurrentUser(): Promise<AuthUser> {
    return getJson<AuthUser>('/api/auth/me');
}