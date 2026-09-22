import { postJson } from '../../../shared/api/httpClient';
import type {
    ConfirmEmailRequest,
    RegisterRequest,
    RegisterResponse,
} from '../../../shared/types/register';

const registrationEndpoint = '/api/auth/register';

export async function registerUser(
    request: RegisterRequest,
): Promise<RegisterResponse> {
    return postJson<RegisterResponse>(registrationEndpoint, request);
}

export async function confirmEmail(request: ConfirmEmailRequest) : Promise<void>
{
    return postJson<void>('/api/auth/confirm-email', request);
}