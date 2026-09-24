import { getJson, putJson } from '@/shared/api/httpClient';

export interface SystemSettings {
    id: string;
    duplicateDistanceMeters: number;
    duplicateTimeWindowHours: number;
    updatedUtc: string;
}

export interface UpdateSystemSettingsRequest {
    duplicateDistanceMeters: number;
    duplicateTimeWindowHours: number;
}

export async function getSystemSettings(): Promise<SystemSettings> {
    return getJson<SystemSettings>('/api/system-settings');
}

export async function updateSystemSettings(
    data: UpdateSystemSettingsRequest
): Promise<SystemSettings> {
    return putJson<SystemSettings>('/api/system-settings', data);
}