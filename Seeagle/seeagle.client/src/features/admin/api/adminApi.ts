import {getJson, patchJson, postJson, putJsonWithBody,putJson} from '@/shared/api/httpClient';
import type { UserListItem } from '@/shared/types/admin';
import type { PagedResult } from '@/shared/types/pagedResult';
import type { ReportType } from '@/shared/types/report';

export async function getUsers(
  page: number, 
  pageSize: number, 
  searchTerm?: string,
  sortBy?: string,
  roleFilter?: number,
  sortDescending?: boolean,
): Promise<PagedResult<UserListItem>> {
  const params = new URLSearchParams({
    pageNumber: String(page),
    pageSize: String(pageSize),
  })
  if (searchTerm) params.set('searchTerm', searchTerm);
  if (sortBy) params.set('sortBy', sortBy);
  if (sortDescending) params.set('sortDescending', String(sortDescending));
  if (roleFilter !== undefined && roleFilter !== null) params.set('roleFilter', String(roleFilter));
  const url = `/api/users?${params.toString()}`;
  return getJson<PagedResult<UserListItem>>(url);
}

export async function assignModerator(userId: string): Promise<UserListItem> {
  return getJson<UserListItem>(`/api/users/${userId}/assign-moderator`);
}
export async function removeModerator(userId: string): Promise<UserListItem> {
  return putJson<UserListItem>(`/api/users/${userId}/remove-moderator`);
}

export async function getReportTypes(page: number, pageSize: number): Promise<PagedResult<ReportType>> {
  return getJson<PagedResult<ReportType>>(`/api/report-types?pageNumber=${page}&pageSize=${pageSize}`)
}

export async function createReportType(
    name: string,
): Promise<ReportType> {
  try {
    return await postJson<ReportType>(
        '/api/report-types',
        { name }
    );
  } catch (error) {
    if (
        error instanceof Error &&
        error.message === 'Request failed with status 409.'
    ) {
      throw new Error('This report type already exists.');
    }

    throw error;
  }
}

export async function updateReportType(
    id: string,
    name: string,
): Promise<ReportType> {
  try {
    return await putJsonWithBody<ReportType>(
        `/api/report-types/${id}`,
        { name }
    );
  } catch (error) {
    if (
        error instanceof Error &&
        error.message === 'Request failed with status 409.'
    ) {
      throw new Error('This report type already exists.');
    }

    throw error;
  }
}

export async function changeReportTypeStatus(
    id: string,
): Promise<ReportType> {
  return patchJson<ReportType>(
      `/api/report-types/${id}/change_status`
  );
}

export async function getAssistantHealth(): Promise<{ status: string }> {
  return getJson<{ status: string }>('/api/admin/health/assistant');
}

export async function getMailServiceHealth(): Promise<{ status: string }> {
  return getJson<{ status: string }>('/api/admin/health/mailservice');
}

export interface ReportSummary {
  byStatus: { status: string; count: number }[];
  byType: { type: string; count: number }[];
  byArea: { areaId: string | null; areaName: string; count: number }[];
  totalCount: number;
}

export async function getReportSummary(): Promise<ReportSummary> {
  return getJson<ReportSummary>('/api/reports/summary');
}