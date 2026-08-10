import { getJson } from '@/shared/api/httpClient';
import type { PagedResult, UserListItem } from '@/shared/types/admin';

export async function getUsers(page: number, pageSize: number): Promise<PagedResult<UserListItem>> {
  return getJson<PagedResult<UserListItem>>(`/api/users?page=${page}&pageSize=${pageSize}`);
}