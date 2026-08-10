import { Map } from './Map';
import { LeftPanel } from './LeftPanel';

export function Homepage() {
    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <LeftPanel />
            <Map />
        </div>
    );
}