export interface  Area {
    id: string;
    name: string;
    coordinates: number[][];
}

export interface CreateAreaRequest {
    name: string;
    coordinates: number[][];
}
export interface CreateAreaResponse {
    id: string;
}