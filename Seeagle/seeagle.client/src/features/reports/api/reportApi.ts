import { postJson } from '@/shared/api/httpClient.ts';
import type { CreateReportRequest, Report } from "@/shared/types/report.ts";
import { getCookie } from "@/shared/utils/cookies.ts";

export async function createReport(data: CreateReportRequest): Promise<Report> {
    const token = getCookie("authToken");
    if (!token) {
        throw new Error("No authentication token found. Please login first.");
    }
    return postJson<Report>('/api/reports', data, token);
}
