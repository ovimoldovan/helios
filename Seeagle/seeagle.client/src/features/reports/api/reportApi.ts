import { postJson } from '@/shared/api/httpClient.ts';
import type { CreateReportRequest, Report } from "@/shared/types/report.ts";

export async function createReport(data: CreateReportRequest): Promise<Report> {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

    return postJson<Report>('/api/reports', data, token);
}
