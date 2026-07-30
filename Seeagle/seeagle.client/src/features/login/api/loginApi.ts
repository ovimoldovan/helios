import { postJson } from '@/shared/api/httpClient';

import type {LoginRequest, LoginResponse } from '@/shared/types/authentication';

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await postJson<LoginResponse>('api/authentication/login', credentials);
    
    if (response.token){
        document.cookie = `authToken=${response.token}; Path=/; Secure; SameSite=Strict;`;
    }
    
    return response;
}