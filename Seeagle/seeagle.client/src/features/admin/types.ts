export interface  Area {
    id: string;
    name: string;
    bounds: [[number, number], [number, number]];
}

export interface CreateAreaRequest {
    name: string;
    northWestLatitude: number;
    northWestLongitude: number;
    southEastLatitude: number;
    southEastLongitude: number;
}
export interface CreateAreaResponse {
    id: string;
}