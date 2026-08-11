import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
    isAdmin: boolean;
    children: ReactNode;
}

export function AdminRoute({ isAdmin, children }: AdminRouteProps) {
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}