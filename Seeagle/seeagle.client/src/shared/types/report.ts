export interface CreateReportRequest {
    latitude: number;
    longitude: number;
    description?: string | null;
    reportTypeId: string;
}
export interface Report {
    id: string;
    longitude: number;
    latitude: number;
    description?: string | null;
    createdUtc: string;
    status: string;
    priority: string;
    type: string;
    messageToReporter?: string | null;
}

export interface ReportType {
    id: string;
    name: string;
    isActive: boolean;
}