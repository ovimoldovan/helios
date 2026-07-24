import { postJson } from '../../../shared/api/httpClient';
import type { RegisterRequest } from '../../../shared/types/register';

const registrationEndpoint = '/api/register';

export async function registerUser(
    request: RegisterRequest,
): Promise<void> {
    await postJson<unknown>(registrationEndpoint, request);
}