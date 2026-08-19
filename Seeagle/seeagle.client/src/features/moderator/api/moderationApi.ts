import { getJson, putJson } from '@/shared/api/httpClient';
import type { PagedResult } from '@/shared/types/pagedResult';
import { getAuthToken } from '@/shared/auth/getAuthToken';

export interface ModerationReport {
    id: string;
    latitude: number;
    longitude: number;
    description: string | null;
    createdUtc: string;
    status: string;
}

export async function getPendingReports(
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    const token = getAuthToken();

    return getJson<PagedResult<ModerationReport>>(
        `/api/reports/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        token ?? undefined
    );
}

export async function approveReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/approve`, token);
}

export async function rejectReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/reject`, token);
}