import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ModeratorRouteProps {
    isModerator: boolean;
    children: ReactNode;
}

export function ModeratorRoute({
    isModerator,
    children,
     }: ModeratorRouteProps) {
    if (!isModerator) {
        return <Navigate to="/" replace />;
    }
    return children;
}