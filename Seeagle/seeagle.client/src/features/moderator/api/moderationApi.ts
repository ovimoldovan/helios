import { deleteJson, getJson, putJson, getBlob } from '@/shared/api/httpClient';
import type { PagedResult } from '@/shared/types/pagedResult';

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
    type: string;
    hasPhoto : boolean;
    isPhotoVisibleToPublic: boolean;
}

export async function getPendingReports(
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    return getJson<PagedResult<ModerationReport>>(
        `/api/reports/pending?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
}

export async function approveReport( id: string, priority: string): Promise<ModerationReport> {
    return putJson<ModerationReport>(
        `/api/reports/${id}/approve?priority=${priority}`
    );
}

export async function rejectReport(id: string, message?: string | null): Promise<ModerationReport> {
    const url = message
        ? `/api/reports/${id}/reject?message=${encodeURIComponent(message)}`
        : `/api/reports/${id}/reject`;

    return putJson<ModerationReport>(url);
}

export async function setPhotoVisibility(id: string, isVisibleToPublic: boolean): Promise<ModerationReport> {
    return putJson<ModerationReport>(
        `api/reports/${id}/photo-visibility?isVisibleToPublic=${isVisibleToPublic}`
    );
}

export async function getApprovedReports(
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    return getJson<PagedResult<ModerationReport>>(
        `/api/reports/approved-list?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
}
export async function markAsSolved(id: string, message?: string | null): Promise<ModerationReport> {
    const url = message
        ? `/api/reports/${id}/solved?message=${encodeURIComponent(message)}`
        : `/api/reports/${id}/solved`;
    return putJson<ModerationReport>(url);
}
export async function sendMessageToReporter(
    id: string,
    message?: string | null
): Promise<ModerationReport> {
    const url = message
        ? `/api/reports/${id}/message?message=${encodeURIComponent(message)}`
        : `/api/reports/${id}/message`;
    return putJson<ModerationReport>(url);
}

export async function getReportsByStatus(
    status: string | null,
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    const statusParam = status ? `&status=${status}` : '';

    return getJson<PagedResult<ModerationReport>>(
        `/api/reports?&pageNumber=${pageNumber}&pageSize=${pageSize}${statusParam}`
    );
}

export async function deleteReport(id: string): Promise<void> {
    return deleteJson(`/api/reports/${id}`);
}

export interface UpdateReportRequest {
    description?: string | null;
    priority?: string;
}
export async function getAllReports(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
): Promise<PagedResult<ModerationReport>> {
    let url = `/api/reports/all?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (sortBy) {
        url += `&sortBy=${sortBy}`;
    }
    if (sortOrder) {
        url += `&sortOrder=${sortOrder}`;
    }
    return getJson<PagedResult<ModerationReport>>(url);
}
export async function updateReport(id: string, data: UpdateReportRequest): Promise<ModerationReport> {
    return putJson<ModerationReport>(`/api/reports/${id}`, data);
}

export async function getAllReportsExceptPending(
    pageNumber: number,
    pageSize: number
): Promise<PagedResult<ModerationReport>> {
    return getJson<PagedResult<ModerationReport>>(
        `/api/reports?excludeStatus=Pending&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
}

export async function exportReportsCsv(
    status?: string | null,
    excludeStatus?: string | null
): Promise<void> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (excludeStatus) params.append('excludeStatus', excludeStatus);
    const blob = await getBlob(`/api/reports/export-csv?${params.toString()}`);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reports.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}