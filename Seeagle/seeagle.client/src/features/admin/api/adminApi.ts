import { getJson } from '@/shared/api/httpClient';
import type { PagedResult, UserListItem } from '@/shared/types/admin';

export async function getUsers(page: number, pageSize: number, token: string): Promise<PagedResult<UserListItem>> {
  return getJson<PagedResult<UserListItem>>(`/api/users?pageNumber=${page}&pageSize=${pageSize}`, token);
}

export async function assignModerator(userId: string, token: string): Promise<UserListItem> {
  return getJson<UserListItem>(`/api/users/${userId}/assign-moderator`, token);
}
