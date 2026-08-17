import { getJson, putJson } from '@/shared/api/httpClient';

export interface ModerationReport {
    id: string;
    latitude: number;
    longitude: number;
    description: string | null;
    createdUtc: string;
    status: string;
}

export async function getPendingReports(token?: string): Promise<ModerationReport[]> {
    return getJson<ModerationReport[]>('/api/reports/pending', token);
}

export async function approveReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/approve`, token);
}

export async function rejectReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/reject`, token);
}