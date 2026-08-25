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
    priority: string;
    isSolved?: boolean;
    messageToReporter?: string | null;
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

export async function approveReport( id: string, priority: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(
        `/api/reports/${id}/approve?priority=${priority}`,
        token
    );
}

export async function rejectReport(id: string, token?: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}/reject`, token);
}

export async function getApprovedReports(
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    const token = getAuthToken();

    return getJson<PagedResult<ModerationReport>>(
        `/api/reports/approved-list?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        token ?? undefined
    );
}
export async function markAsSolved(id: string, message?: string | null,  token?: string): Promise<ModerationReport> {
    const url = message
        ? `/api/reports/${id}/solved?message=${encodeURIComponent(message)}`
        : `/api/reports/${id}/solved`;
    return putJson<ModerationReport>(url, token);
}
export async function sendMessageToReporter(
    id: string,
    message?: string | null,
    token?: string
): Promise<ModerationReport> {
    const url = message
        ? `/api/reports/${id}/message?message=${encodeURIComponent(message)}`
        : `/api/reports/${id}/message`;
    return putJson<ModerationReport>(url, token);
}