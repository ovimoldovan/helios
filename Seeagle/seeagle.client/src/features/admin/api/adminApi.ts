import { getJson } from '@/shared/api/httpClient';
import type { UserListItem } from '@/shared/types/admin';
import type { PagedResult } from '@/shared/types/pagedResult';
import type { ReportType } from '@/shared/types/report';

export async function getUsers(page: number, pageSize: number, token: string): Promise<PagedResult<UserListItem>> {
  return getJson<PagedResult<UserListItem>>(`/api/users?pageNumber=${page}&pageSize=${pageSize}`, token);
}

export async function assignModerator(userId: string, token: string): Promise<UserListItem> {
  return getJson<UserListItem>(`/api/users/${userId}/assign-moderator`, token);
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
    throw new Error('This report type already exists.');
  }

  if (!response.ok) {
    throw new Error('Failed to create report type.');
  }

  return await response.json() as ReportType;
}
