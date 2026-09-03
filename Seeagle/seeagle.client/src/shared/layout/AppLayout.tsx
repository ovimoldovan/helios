import { Outlet } from 'react-router-dom';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';

export function AppLayout() {
    return (
        <div className="flex h-screen">
            <LeftPanel />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}