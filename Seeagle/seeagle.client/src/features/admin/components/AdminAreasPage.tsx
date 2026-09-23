import {useState, useCallback, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { DrawableMap } from './DrawableMap';
import { AreasSidePanel } from './AreasSidePanel';
import { getJson, postJson, putJsonWithBody, deleteJson } from '@/shared/api/httpClient';
import type { Area, CreateAreaRequest, CreateAreaResponse } from '../types';
import { useTranslation } from 'react-i18next';

export function AdminAreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [nextId, setNextId] = useState(1);
    const [drawMode, setDrawMode] = useState<'rectangle' | 'polygon' | null>(null);
    const { t } = useTranslation();
    
    useEffect(() => {
        const loadAreas = async () => {
            try {
                const data = await getJson<Area[]>('/api/areas');
                setAreas(data);
            } catch (error) {
                console.error('Failed to load areas:', error);
            }
        };
        loadAreas();
    }, []);

    const handleAreaCreated = useCallback(async (coordinates: number[][]) => {
        const request: CreateAreaRequest = {
            name: `Area ${nextId}`,
            coordinates
        };
        try {
            const response = await postJson<CreateAreaResponse>('/api/areas', request);
            const newArea: Area = {
                id: response.id,
                name: response.name,
                slug: response.slug,
                coordinates,
            };
            setAreas((prev) => [...prev, newArea]);
            setNextId((prev) => prev + 1);
        } catch (error) {
            console.error('Failed to create area:', error);
        }
    }, [nextId]);

    function handleDeleteArea(id: string) {
        deleteJson(`/api/areas/${id}`)
            .then(() => {
                setAreas(areas.filter((a) => a.id !== id));
            })
            .catch((error) => {
                console.error('Failed to delete area:', error);
            });
    }

    function handleRenameArea(id: string, newName: string) {
        putJsonWithBody<Area>(`/api/areas/${id}`, { name: newName })
            .then((updated) => {
                setAreas(areas.map((a) => a.id === id ? updated : a));
            })
            .catch((error) => {
                console.error('Failed to rename area:', error);
            });
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <div className="fixed top-4 left-84 z-9999">
                <Link
                    to="/"
                    className="bg-white px-3 py-1.5 rounded-full text-sm text-gray-700 shadow hover:bg-gray-100 transition"
                >
                    ← {t('backToHome')}
                </Link>
            </div>

            <AreasSidePanel
                areas={areas}
                onDeleteArea={handleDeleteArea}
                onRenameArea={handleRenameArea}
                onStartDraw={setDrawMode}
            />

            <DrawableMap
                areas={areas}
                onAreaCreated={handleAreaCreated}
                drawMode={drawMode}
                onDrawComplete={() => setDrawMode(null)}
            />
        </div>
    );
}