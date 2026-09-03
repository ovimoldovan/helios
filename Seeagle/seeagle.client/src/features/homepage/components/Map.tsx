import {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report } from '@/shared/types/report';
import {getPriorityColor, getStatusColor} from "@/shared/constants/reportColors.ts";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createColoredIcon(color: string) {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
                <circle cx="16" cy="15" r="6" fill="white"/>
            </svg>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    });
}

interface MapProps {
    onPinPlaced?: (position: [number, number] | null) => void;
    reports?: Report[];
    isPlacingPin?: boolean;
    pinPosition?: [number, number] | null;
}

function PinManager({ onPinPlaced, isPlacingPin, pinPosition}: {
    onPinPlaced?: (position: [number, number] | null) => void;
    isPlacingPin?: boolean;
    pinPosition?: [number, number] | null;
}) {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        setPosition(pinPosition || null);
    }, [pinPosition]);

    useMapEvents({
        click(e) {
            if (isPlacingPin) {
                const pos: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(pos);
                onPinPlaced?.(pos);
            }
        },
    });

    return position ? <Marker position={position} /> : null;
}

function ReportMarkers({ reports }: { reports?: Report[] }) {
    if (!reports) return null;
    
    return reports.map((report) => {
        const isPending = report.status === 'Pending';
        const markerColor = isPending
            ? getStatusColor('Pending')
            : getPriorityColor(report.priority);

        return (
            <Marker key={report.id} position={[report.latitude, report.longitude]} icon={createColoredIcon(markerColor)}>
                <Popup>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: markerColor }}
                            />
                            <strong>{report.status}</strong>
                        </div>
                        {report.description && (<p className="text-sm">{report.description}</p>)}
                        {report.status === 'Approved' && report.priority && (
                            <p className="text-xs font-medium mt-1">
                                Priority: {report.priority}
                            </p>
                        )}
                        <small className="block text-xs text-gray-500">
                            {new Date(report.createdUtc).toLocaleString()}
                        </small>
                    </div>
                </Popup>
            </Marker>
    );
    });
}

export function Map({ onPinPlaced, reports = [], isPlacingPin = false, pinPosition }: MapProps) {
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
            <PinManager onPinPlaced={onPinPlaced} isPlacingPin={isPlacingPin} pinPosition={pinPosition}/>
            <ReportMarkers reports={reports} />
        </MapContainer>
    );
}