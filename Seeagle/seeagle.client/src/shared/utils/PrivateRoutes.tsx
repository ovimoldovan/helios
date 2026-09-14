import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '@/shared/context/AuthContext';

interface PrivateRoutesProps {
    allowedRoles?: string[];
}

export function PrivateRoutes({ allowedRoles }: PrivateRoutesProps = {}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location.pathname,
                    title: 'Error',
                    description: 'Log in to access this page',
                }}
                replace
            />
        );
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to="/unauthorized" />;
    }
    
    return <Outlet />;
}