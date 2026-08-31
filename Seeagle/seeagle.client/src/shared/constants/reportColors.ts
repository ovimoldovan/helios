export const PRIORITY_COLORS: Record<string, string> = {
    low: '#22c55e',
    medium: '#eab308',
    urgent: '#dc2626',
};

export const STATUS_COLORS: Record<string, string> = {
    pending: '#3b82f6',
    approved: '#22c55e',
    rejected: '#ef4444',
    solved: '#8b5cf6',
};

export const getPriorityColor = (priority: string) =>
    PRIORITY_COLORS[priority?.toLowerCase()] ?? PRIORITY_COLORS.low;

export const getStatusColor = (status: string) =>
    STATUS_COLORS[status?.toLowerCase()] ?? STATUS_COLORS.pending;
