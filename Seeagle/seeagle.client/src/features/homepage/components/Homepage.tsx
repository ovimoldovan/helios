import { Map } from './Map';
import { LeftPanel } from './LeftPanel';

interface HomepageProps {
    isAuthenticated?: boolean;
}

export function Homepage({ isAuthenticated = false }: HomepageProps) {
    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <LeftPanel isAuthenticated={isAuthenticated} />
            <Map />
        </div>
    );
}