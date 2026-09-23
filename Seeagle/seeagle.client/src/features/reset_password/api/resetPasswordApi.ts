import {getJson, postJson} from "@/shared/api/httpClient.ts";
import type {ResetPasswordRequest} from "@/features/reset_password/types.ts";

export async function forgotPassword(email:string) : Promise<void> {
    return postJson<void>('api/auth/forgot-password', { email });
}

export async function completePasswordReset(request: ResetPasswordRequest): Promise<void> {
    return postJson<void>('/api/auth/reset-password', request);
}

export async function validateResetPasswordToken(token: string): Promise<void> {
    return getJson<void>(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`);
}