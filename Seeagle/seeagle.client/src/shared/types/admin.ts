export interface UserListItem {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: number;
}

export const AssistantStatus = {
    Online: 'online',
    Offline: 'offline',
    Checking: 'checking'
} as const;

export type AssistantStatus = typeof AssistantStatus[keyof typeof AssistantStatus];
