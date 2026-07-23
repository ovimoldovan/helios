import { getJson, postJson } from '../../../shared/api/httpClient';
import type { SampleName } from '../../../shared/types/sampleName';

export interface ValidationProblemDetails {
  errors?: Record<string, string[]>;
}

export async function getSampleNames(): Promise<SampleName[]> {
  return getJson<SampleName[]>('/api/sample-names');
}

export async function createSampleName(name: string): Promise<SampleName> {
  return postJson<SampleName>('/api/sample-names', { name });
}
