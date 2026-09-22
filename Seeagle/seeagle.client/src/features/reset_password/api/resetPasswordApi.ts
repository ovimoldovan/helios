import {postJson} from "@/shared/api/httpClient.ts";

export async function resetPassword(email:string) : Promise<void> {
    return postJson<void>('api/auth/forgot-password', { email });
}