import { Map } from './Map';
import { LeftPanel } from './LeftPanel';

interface HomepageProps {
    isAuthenticated?: boolean;
}

export function Homepage({ isAuthenticated = false }: HomepageProps) {
    return (
        <div className="relative h-[100dvh] w-screen overflow-hidden">
            <LeftPanel isAuthenticated={isAuthenticated} />
            <Map />
        </div>
    );
}