import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import type { Area } from '../types';

const BORDER_COLOR = '#15803d';
const FILL_COLOR = '#15803d';
const FILL_OPACITY = 0.15;
const BORDER_WEIGHT = 2;

const shapeOptions = {
    color: BORDER_COLOR,
    fillColor: FILL_COLOR,
    fillOpacity: FILL_OPACITY,
    weight: BORDER_WEIGHT,
};

interface DrawableMapProps {
    areas: Area[];
    onAreaCreated: (coordinates: number[][]) => void;
    drawMode: 'rectangle' | 'polygon' | null;
    onDrawComplete: () => void;
}

function DrawControls({ areas, onAreaCreated, drawMode, onDrawComplete }: DrawableMapProps) {
    const map = useMap();
    const featureGroupRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
    const drawControlRef = useRef<L.Control.Draw | null>(null);

    useEffect(() => {
        const featureGroup = featureGroupRef.current;
        map.addLayer(featureGroup);

        const drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                rectangle: { showArea: false, shapeOptions },
                polygon: { showArea: true, shapeOptions },
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
        drawControlRef.current = drawControl;

        const container = (drawControl as any).getContainer();
        if (container) container.style.display = 'none';

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
            const layer = e.layer;
            let coords: number[][] = [];

            if (e.layerType === 'rectangle') {
                const bounds = layer.getBounds();
                coords = [
                    [bounds.getNorthWest().lat, bounds.getNorthWest().lng],
                    [bounds.getSouthEast().lat, bounds.getSouthEast().lng],
                ];
            } else if (e.layerType === 'polygon') {
                const latlngs = layer.getLatLngs()[0] as L.LatLng[];
                coords = latlngs.map(ll => [ll.lat, ll.lng]);
            }
            onAreaCreated(coords);
            onDrawComplete();
        });

        return () => {
            map.removeControl(drawControl);
            map.off('draw:drawstart');
            map.off('draw:drawstop');
            map.off(L.Draw.Event.CREATED);
            map.removeLayer(featureGroup);
            drawControlRef.current = null;
        };
    }, [map, onAreaCreated, onDrawComplete]);

    useEffect(() => {
        const control = drawControlRef.current;
        if (!control || !drawMode) return;

        const toolbars = (control as any)._toolbars;
        if (!toolbars?.draw?._modes) return;

        const modes = toolbars.draw._modes;
        if (drawMode === 'rectangle' && modes.rectangle) {
            modes.rectangle.handler.enable();
        } else if (drawMode === 'polygon' && modes.polygon) {
            modes.polygon.handler.enable();
        }
    }, [drawMode]);

    useEffect(() => {
        featureGroupRef.current.clearLayers();

        areas.forEach((area) => {
            let shape;
            if (area.coordinates.length === 2) {
                shape = L.rectangle(area.coordinates as [[number, number], [number, number]], shapeOptions);
            } else {
                shape = L.polygon(area.coordinates as [number, number][], shapeOptions);
            }
            shape.bindTooltip(area.name, { permanent: true, direction: 'center', className: 'area-label' });
            featureGroupRef.current.addLayer(shape);
        });
    }, [areas]);

    return null;
}

export function DrawableMap({ areas, onAreaCreated, drawMode, onDrawComplete }: DrawableMapProps) {
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
            <DrawControls
                areas={areas}
                onAreaCreated={onAreaCreated}
                drawMode={drawMode}
                onDrawComplete={onDrawComplete}
            />
        </MapContainer>
    );
}