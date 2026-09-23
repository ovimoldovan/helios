import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from '@/shared/context/AuthContext';
import {useTranslation} from "react-i18next";

interface PrivateRoutesProps {
    allowedRoles?: string[];
}

export function PrivateRoutes({ allowedRoles }: PrivateRoutesProps = {}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();
    const { t } = useTranslation(); 

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{
                    from: location.pathname,
                    title: t('unauthenticatedToastTitle'),
                    description: t('unauthenticatedToastDescription'),
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