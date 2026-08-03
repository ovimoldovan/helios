import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report } from '@/shared/types/report';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
    onPinPlaced?: (position: [number, number] | null) => void;
    reports?: Report[];
    isPlacingPin?: boolean;
}

function PinManager({ onPinPlaced, isPlacingPin }: {
    onPinPlaced?: (position: [number, number] | null) => void;
    isPlacingPin?: boolean;
}) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            if (isPlacingPin) {
                const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(pos);
                onPinPlaced?.(pos);
            }
        },
    });

    const handleDragEnd = (e: L.DragEndEvent) => {
        const marker = e.target;
        const latlng = marker.getLatLng();
        const pos: [number, number] = [latlng.lat, latlng.lng];
        setPosition(pos);
        onPinPlaced?.(pos);
    };

    return position ? (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
        >
            <Popup>
                📍 {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </Popup>
        </Marker>
    ) : null;
}

function ReportMarkers({ reports }: { reports?: Report[] }) {
    if (!reports) return null;

    return reports.map((report) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
                <strong>{report.status}</strong>
                {report.description && <p className="text-sm">{report.description}</p>}
                <small className="text-xs text-gray-500">
                    {new Date(report.createdUtc).toLocaleString()}
                </small>
            </Popup>
        </Marker>
    ));
}

export function Map({ onPinPlaced, reports = [], isPlacingPin = false }: MapProps) {
    return (
        <MapContainer
            center={[45.9432, 24.9668]}
            zoom={7}
            style={{ height: '100vh', width: '100%' }}
            zoomControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <PinManager onPinPlaced={onPinPlaced} isPlacingPin={isPlacingPin} />
            <ReportMarkers reports={reports} />
        </MapContainer>
    );
}