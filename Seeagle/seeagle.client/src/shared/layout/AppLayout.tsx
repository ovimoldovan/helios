import { Outlet } from 'react-router-dom';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';

export function AppLayout() {
    return (
        <div className="flex min-h-screen">
            <LeftPanel />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}