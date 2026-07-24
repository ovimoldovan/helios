import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pentru iconițe
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componentă pentru un pin draggable
function DraggableMarker({ position, id }: any) {
    return (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
            }}
        >
            <Popup>
                 Pin #{id}
                <br />
                {position[0].toFixed(4)}, {position[1].toFixed(4)}
                <br />
            </Popup>
        </Marker>
    );
}

// Componentă care gestionează pin-urile
function PinManager() {
    const [pins, setPins] = useState<Array<{ id: number; position: [number, number] }>>([]);
    const [nextId, setNextId] = useState(1);

    useMapEvents({
        click(e) {
            // Adaugă un pin nou la click
            const newPin = {
                id: nextId,
                position: [e.latlng.lat, e.latlng.lng] as [number, number],
            };
            setPins([...pins, newPin]);
            setNextId(nextId + 1);
        },
    });

    const handleDragEnd = (id: number, newPosition: [number, number]) => {
        setPins(pins.map(pin =>
            pin.id === id ? { ...pin, position: newPosition } : pin
        ));
    };

    return (
        <>
            {pins.map((pin) => (
                <DraggableMarker
                    key={pin.id}
                    id={pin.id}
                    position={pin.position}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </>
    );
}

export function Map() {
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
            <PinManager />
        </MapContainer>
    );
}