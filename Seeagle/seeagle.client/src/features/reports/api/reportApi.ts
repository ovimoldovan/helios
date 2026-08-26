import { postJson, getJson } from '@/shared/api/httpClient.ts';
import type { CreateReportRequest, Report } from "@/shared/types/report.ts";
import { getCookie } from "@/shared/utils/cookies.ts";

export async function createReport(data: CreateReportRequest): Promise<Report> {
    const token = getCookie("authToken");
    if (!token) {
        throw new Error("No authentication token found. Please login first.");
    }
    
    return postJson<Report>('/api/reports', data, token);
}

export async function getApprovedReports(days: number = 30): Promise<Report[]> {
    const token = getCookie("authToken");
    return getJson<Report[]>(`/api/reports/approved?days=${days}`, token);
}
