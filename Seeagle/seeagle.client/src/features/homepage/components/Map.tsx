import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, Tooltip, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Report } from '@/shared/types/report';
import { getPriorityColor, getStatusColor } from "@/shared/constants/reportColors.ts";
import type { Area } from '@/features/admin/types';

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

function createRejectedIcon() {
    return L.divIcon({
        className: 'custom-marker-rejected',
        html: `
            <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="12" fill="#6b7280" stroke="white" stroke-width="2"/>
                <line x1="9" y1="9" x2="19" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <line x1="19" y1="9" x2="9" y2="19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
    });
}

interface MapProps {
    onPinPlaced?: (position: [number, number] | null) => void;
    reports?: Report[];
    isPlacingPin?: boolean;
    pinPosition?: [number, number] | null;
    areas?: Area[];
    selectedReportId?: string;
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

function SelectedReportFocus({ reports, selectedReportId }: { reports?: Report[]; selectedReportId?: string }) {
    const map = useMap();

    useEffect(() => {
        if (!reports || !selectedReportId) return;

        const selectedReport = reports.find(report => report.id === selectedReportId);
        if (!selectedReport) return;

        map.flyTo([selectedReport.latitude, selectedReport.longitude], 16);
    }, [map, reports, selectedReportId]);

    return null;
}

function getMarkerIcon(report: Report) {
    if (report.status === 'Pending') {
        return createColoredIcon(getStatusColor('Pending'));
    }
    if (report.status === 'Rejected') {
        return createRejectedIcon();
    }
    return createColoredIcon(getPriorityColor(report.priority));
}

function ReportMarkers({ reports }: { reports?: Report[] }) {
    if (!reports) return null;

    return reports.map((report) => {
        const icon = getMarkerIcon(report);
        const badgeColor = report.status === 'Rejected'
            ? '#6b7280'
            : (report.status === 'Pending' ? getStatusColor('Pending') : getPriorityColor(report.priority));


        return (
            <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={icon}
            >
                <Popup>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full inline-block"
                                style={{ backgroundColor: badgeColor }}
                            />
                            <strong>{report.status}</strong>
                        </div>
                        {report.description && (<p className="text-sm">{report.description}</p>)}
                        {report.type && (
                            <p className="text-xs font-medium mt-1">
                                Type: {report.type}
                            </p>
                        )}
                        {report.status === 'Approved' && report.priority && (
                            <p className="text-xs font-medium mt-1">
                                Priority: {report.priority}
                            </p>
                        )}
                        <small className="block text-xs text-gray-500">
                            {new Date(report.createdUtc).toLocaleString()}
                        </small>
                        {report.hasPhoto && report.showPhotoToPublic && (
                            <img
                                src={`/api/reports/${report.id}/photo`}
                                alt=""
                                loading="lazy"
                                className="mt-2 h-32 w-48 rounded object-cover"
                            />
                        )}
                    </div>
                </Popup>
            </Marker>
        );
    });
}

function AreaLayers({ areas }: { areas?: Area[] }) {
    if (!areas || areas.length === 0) return null;

    return areas.map((area) => {
        const positions: [number, number][] = area.coordinates.map(c => [c[0], c[1]]);
        return (
            <Polygon
                key={area.id}
                positions={positions}
                pathOptions={{
                    color: '#15803d',
                    fillColor: '#15803d',
                    fillOpacity: 0.15,
                    weight: 2,
                }}
            >
                <Tooltip permanent direction="center">
                    {area.name}
                </Tooltip>
            </Polygon>
        );
    });
}

export function Map({onPinPlaced, reports = [], isPlacingPin = false, pinPosition, areas = [], selectedReportId}: MapProps) {
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
            <SelectedReportFocus reports={reports} selectedReportId={selectedReportId} />
            <PinManager onPinPlaced={onPinPlaced} isPlacingPin={isPlacingPin} pinPosition={pinPosition}/>
            <AreaLayers areas={areas} />
            <ReportMarkers reports={reports} />
        </MapContainer>
    );
}