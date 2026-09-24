import { putJson } from '@/shared/api/httpClient';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface UpdateProfileRequest {
    email: string;
    firstName: string;
    lastName: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return putJson<UserProfile>('/api/users/me/profile', data);
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
    return putJson<void>('/api/users/me/password', data);
}