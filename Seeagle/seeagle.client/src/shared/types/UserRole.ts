export const UserRole = {
    User: 'User',
    Admin: 'Admin',
    Moderator: 'Moderator',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];