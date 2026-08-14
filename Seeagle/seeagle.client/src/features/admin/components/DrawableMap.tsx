import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { Area } from '../types';

const RECTANGLE_BORDER_COLOR = '#15803d';
const RECTANGLE_FILL_COLOR = '#15803d';
const RECTANGLE_FILL_OPACITY = 0.15;
const RECTANGLE_BORDER_WEIGHT = 2;

interface DrawableMapProps {
    areas: Area[];
    onAreaCreated: (bounds: [[number, number], [number, number]]) => void;
}

function DrawControls({ areas, onAreaCreated }: DrawableMapProps) {
    const map = useMap();
    const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

    useEffect(() => {
        const featureGroup = featureGroupRef.current;
        map.addLayer(featureGroup);

        const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                rectangle: {
                    showArea: false,
                    shapeOptions: {
                        color: RECTANGLE_BORDER_COLOR,
                        fillColor: RECTANGLE_FILL_COLOR,
                        fillOpacity: RECTANGLE_FILL_OPACITY,
                        weight: RECTANGLE_BORDER_WEIGHT,
                    },
                },
                polygon: false,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
            },
            edit: {
                featureGroup: featureGroup,
                remove: false,
                edit: false,
            },
        });

        map.addControl(drawControl);

        map.on('draw:drawstart', () => {
            map.dragging.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
        });

        map.on('draw:drawstop', () => {
            map.dragging.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
        });

        map.on(L.Draw.Event.CREATED, (e: any) => {
            const bounds = e.layer.getBounds();
            onAreaCreated([
                [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
                [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
            ]);
        });

        return () => {
            map.removeControl(drawControl);
            map.off('draw:drawstart');
            map.off('draw:drawstop');
            map.off(L.Draw.Event.CREATED);
            map.removeLayer(featureGroup);
        };
    }, [map, onAreaCreated]);

    useEffect(() => {
        featureGroupRef.current.clearLayers();

        areas.forEach((area) => {
            const rect = L.rectangle(area.bounds, {
                color: RECTANGLE_BORDER_COLOR,
                fillColor: RECTANGLE_FILL_COLOR,
                weight: RECTANGLE_BORDER_WEIGHT,
                fillOpacity: RECTANGLE_FILL_OPACITY,
            });
            rect.bindTooltip(area.name, { permanent: true, direction: 'center', className: 'area-label' });
            featureGroupRef.current.addLayer(rect);
        });
    }, [areas]);

    return null;
}

export function DrawableMap({ areas, onAreaCreated }: DrawableMapProps) {
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
            <DrawControls areas={areas} onAreaCreated={onAreaCreated} />
        </MapContainer>
    );
}