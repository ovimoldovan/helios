import { getJson } from '@/shared/api/httpClient.ts';
import type { Area } from '@/features/admin/types';

export async function getAreas(): Promise<Area[]> {
    return getJson<Area[]>('/api/areas');
}