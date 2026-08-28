export const Priority = {
    Low: 'low',
    Medium: 'medium',
    Urgent: 'urgent',
} as const;

export type Priority = typeof Priority[keyof typeof Priority];