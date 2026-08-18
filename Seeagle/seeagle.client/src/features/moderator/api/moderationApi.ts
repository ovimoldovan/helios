import { getJson, putJson } from '@/shared/api/httpClient';

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

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
    pageSize: number,
    token?: string
): Promise<PagedResult<ModerationReport>> {
    return getJson<PagedResult<ModerationReport>>(
        `/api/reports/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        token
    );
}

export async function approveReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/approve`, token);
}

export async function rejectReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/reject`, token);
}