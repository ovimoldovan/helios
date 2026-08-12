import { postJson } from './httpClient';
import type { CreateReportRequest, Report } from "../types/report.ts";

export async function createReport(data: CreateReportRequest): Promise<Report> {
    return postJson<Report>('/api/reports', data); 
}
