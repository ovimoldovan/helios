import { postJson, getJson, postFormData} from '@/shared/api/httpClient.ts';
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

export async function uploadReportPhoto(reportId: string, file: File): Promise<Report> {
    const token = getCookie("authToken");
    if (!token) {
        throw new Error("No authentication token found. Please login first.");
    }
    
    const formData = new FormData();
    formData.append("file", file);
    
    return postFormData<Report>(`/api/reports/${reportId}/photo`, formData, token);
}
