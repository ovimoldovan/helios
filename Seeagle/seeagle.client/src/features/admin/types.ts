export interface Area {
    id: string;
    name: string;
    slug: string;
    coordinates: number[][];
}

export interface CreateAreaRequest {
    name: string;
    coordinates: number[][];
}
export interface CreateAreaResponse {
    id: string;
    name: string;
    slug: string;
}