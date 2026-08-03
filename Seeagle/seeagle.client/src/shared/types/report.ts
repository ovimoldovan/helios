export interface CreateReportRequest {
    latitude: number;
    longitude: number;
    description?: string | null;
}
 export interface Report {
    id: string;
    latitude: number;
    longitude: number;
    description?: string | null;
    createdUtc: string;
    status: string;
 }