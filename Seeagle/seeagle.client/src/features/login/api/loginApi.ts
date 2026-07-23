import { postJson } from '@/shared/api/httpClient';

import type {LoginRequest, LoginResponse } from '@/shared/types/authentication';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    return postJson<LoginResponse>('api/authentication/login', credentials);
}