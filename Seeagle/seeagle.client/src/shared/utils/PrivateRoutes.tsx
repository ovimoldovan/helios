import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {getAuthToken} from '@/shared/auth/getAuthToken';
import {getUserRole} from '@/shared/auth/getUserRole';

interface PrivateRoutesProps {
    allowedRoles?: string[];
}

export function PrivateRoutes({ allowedRoles }: PrivateRoutesProps = {}) {
    const token = getAuthToken();
    const location = useLocation();

    if (!token) {
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

    const userRole = getUserRole(token);

    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        return <Navigate to="/unauthorized" />;
    }
    
    return <Outlet />;
}