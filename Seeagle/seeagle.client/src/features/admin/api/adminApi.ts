import { getJson } from '@/shared/api/httpClient';
import type { UserListItem } from '@/shared/types/admin';
import type { PagedResult } from '@/shared/types/pagedResult';

export async function getUsers(page: number, pageSize: number, token: string): Promise<PagedResult<UserListItem>> {
  return getJson<PagedResult<UserListItem>>(`/api/users?pageNumber=${page}&pageSize=${pageSize}`, token);
}

export async function assignModerator(userId: string, token: string): Promise<UserListItem> {
  return getJson<UserListItem>(`/api/users/${userId}/assign-moderator`, token);
}

export interface ReportType {
  id: string;
  name: string;
}

export async function createReportType(
    name: string,
    token: string
): Promise<ReportType> {
  const response = await fetch('/api/report-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (response.status === 409) {
    throw new Error('DUPLICATE_REPORT_TYPE');
  }

  if (!response.ok) {
    throw new Error('CREATE_REPORT_TYPE_FAILED');
  }

  return await response.json() as ReportType;
}
