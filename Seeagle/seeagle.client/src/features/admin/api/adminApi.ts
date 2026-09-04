import { getJson, postJson, putJson, putJsonWithBody } from '@/shared/api/httpClient';
import type { UserListItem } from '@/shared/types/admin';
import type { PagedResult } from '@/shared/types/pagedResult';
import type { ReportType } from '@/shared/types/report';

export async function getUsers(page: number, pageSize: number, token: string): Promise<PagedResult<UserListItem>> {
  return getJson<PagedResult<UserListItem>>(`/api/users?pageNumber=${page}&pageSize=${pageSize}`, token);
}

export async function assignModerator(userId: string, token: string): Promise<UserListItem> {
  return getJson<UserListItem>(`/api/users/${userId}/assign-moderator`, token);
}

export async function getReportTypes(token: string): Promise<ReportType[]> {
  return getJson<ReportType[]>('/api/report-types', token);
}

export async function createReportType(
    name: string,
    token: string
): Promise<ReportType> {
  try {
    return await postJson<ReportType>(
        '/api/report-types',
        { name },
        token
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
    token: string
): Promise<ReportType> {
  try {
    return await putJsonWithBody<ReportType>(
        `/api/report-types/${id}`,
        { name },
        token
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

export async function disableReportType(
    id: string,
    token: string
): Promise<ReportType> {
  return putJson<ReportType>(
      `/api/report-types/${id}/disable`,
      token
  );
}

export async function getAssistantHealth(token: string): Promise<{ status: string }> {
  return getJson<{ status: string }>('/api/admin/health/assistant', token);
}