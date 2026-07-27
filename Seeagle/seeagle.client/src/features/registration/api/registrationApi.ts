import { postJson } from '../../../shared/api/httpClient';
import type {
    RegisterRequest,
    RegisterResponse,
} from '../../../shared/types/register';

const registrationEndpoint = '/api/auth/register';

export async function registerUser(
    request: RegisterRequest,
): Promise<RegisterResponse> {
    return postJson<RegisterResponse>(registrationEndpoint, request);
}