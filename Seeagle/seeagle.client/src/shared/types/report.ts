export interface CreateReportRequest {
    latitude: number;
    longitude: number;
    description?: string | null;
}
export interface Report {
    id: string;
    longitude: number;
    latitude: number;
    description?: string | null;
    createdUtc: string;
    status: string;
}

export interface ReportType {
    id: string;
    name: string;
    isActive: boolean;
}