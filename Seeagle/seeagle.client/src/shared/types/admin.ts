export interface UserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}