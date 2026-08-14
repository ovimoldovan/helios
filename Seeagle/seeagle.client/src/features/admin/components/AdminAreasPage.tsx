import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DrawableMap } from './DrawableMap';
import { AreasSidePanel } from './AreasSidePanel';
import { postJson } from '@/shared/api/httpClient';
import { getCookie } from '@/shared/utils/cookies';
import type { Area, CreateAreaRequest, CreateAreaResponse } from '../types';

export function AdminAreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [nextId, setNextId] = useState(1);

    // TODO (Backend): fetch existing areas on page load using getJson

    const handleAreaCreated = useCallback(async(bounds: [[number, number], [number, number]]) => {
        const request: CreateAreaRequest = {
            name: `Area ${nextId}`,
            northWestLatitude: bounds[0][0],
            northWestLongitude: bounds[0][1],
            southEastLatitude: bounds[1][0],
            southEastLongitude: bounds[1][1],
        };
        try {
            const token = getCookie('authToken');
            const response = await postJson<CreateAreaResponse>('/api/areas', request, token ?? undefined);
            const newArea: Area = {
                id: response.id,
                name: request.name,
                bounds,
            };
            setAreas((prev) => [...prev, newArea]);
            setNextId((prev) => prev + 1);
        } catch (error) { 
            // Remove after backend is merged
            const newArea: Area = {
            id: String(nextId),
            name: `Area ${nextId}`,
            bounds,
        };
        setAreas((prev) => [...prev, newArea]);
        setNextId((prev) => prev + 1);
        }
    }, [nextId]);

    function handleDeleteArea(id: string) {
        // TODO (Backend): Make a DELETE request to `/api/areas/${id}` 
        setAreas(areas.filter((a) => a.id !== id));
    }

    function handleRenameArea(id: string, newName: string) {
        // TODO (Backend): Make a PUT request to `/api/areas/${id}`
        setAreas(areas.map((a) => a.id === id ? { ...a, name: newName } : a));
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="fixed top-4 left-84 z-9999">
                <Link
                    to="/"
                    className="bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow hover:bg-gray-100 transition"
                >
                    ← Back to Home
                </Link>
            </div>

            <AreasSidePanel
                areas={areas}
                onDeleteArea={handleDeleteArea}
                onRenameArea={handleRenameArea}
            />

            <DrawableMap
                areas={areas}
                onAreaCreated={handleAreaCreated}
            />
        </div>
    );
}