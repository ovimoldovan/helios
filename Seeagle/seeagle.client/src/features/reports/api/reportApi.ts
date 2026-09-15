import { postJson, getJson, postFormData } from '@/shared/api/httpClient.ts';
import type {CreateReportRequest, Report, ReportType} from "@/shared/types/report.ts";
import type {PagedResult} from "@/shared/types/pagedResult.ts";

export async function createReport(data: CreateReportRequest): Promise<Report> {
    return postJson<Report>('/api/reports', data);
}

export async function getApprovedReports(days: number = 30): Promise<Report[]> {
    return getJson<Report[]>(`/api/reports/approved?days=${days}`);
}

export async function uploadReportPhoto(reportId: string, file: File): Promise<Report> {
    const formData = new FormData();
    formData.append("file", file);
    
    return postFormData<Report>(`/api/reports/${reportId}/photo`, formData);
}

export async function getMyReports(pageNumber: number = 1, pageSize: number = 10): Promise<PagedResult<Report>> {
    return getJson<PagedResult<Report>>(
        `/api/reports/my?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
}

export async function getActiveReportTypes(page: number, pageSize: number): Promise<PagedResult<ReportType>> {
    return getJson<PagedResult<ReportType>>(`/api/report-types?pageNumber=${page}&pageSize=${pageSize}&onlyActive=true`)
}