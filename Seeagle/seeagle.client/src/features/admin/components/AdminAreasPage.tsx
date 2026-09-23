import {useState, useCallback, useEffect} from 'react';
import { DrawableMap } from './DrawableMap';
import { AreasSidePanel } from './AreasSidePanel';
import { getJson, postJson, putJsonWithBody, deleteJson } from '@/shared/api/httpClient';
import type { Area, CreateAreaRequest, CreateAreaResponse } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

export function AdminAreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [drawMode, setDrawMode] = useState<'rectangle' | 'polygon' | null>(null);
    const [pendingCoordinates, setPendingCoordinates] = useState<number[][] | null>(null);
    const [areaName, setAreaName] = useState('');
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [drawError, setDrawError] = useState<string | null>(null);
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
    
    const handleAreaCreated = useCallback((coordinates: number[][]) => {
        setPendingCoordinates(coordinates);
        setAreaName('');
        setCreateError(null);
        setIsNameModalOpen(true);
    }, []);

    const handleDrawComplete = useCallback(() => {
        setDrawMode(null);
    }, []);

    const handleCreateArea = async () => {
        const trimmedName = areaName.trim();

        if (!pendingCoordinates || trimmedName.length === 0 || trimmedName.length > 30) {
            return;
        }

        const request: CreateAreaRequest = {
            name: trimmedName,
            coordinates: pendingCoordinates
        };

        try {
            const response = await postJson<CreateAreaResponse>('/api/areas', request);

            const newArea: Area = {
                id: response.id,
                name: request.name,
                coordinates: pendingCoordinates,
            };

            setAreas((prev) => [...prev, newArea]);
            setPendingCoordinates(null);
            setAreaName('');
            setCreateError(null);
            setIsNameModalOpen(false);
        }  catch (error) {
        console.error('Failed to create area:', error);

        if (
            typeof error === 'object' &&
            error !== null &&
            'message' in error
        ) {
            setCreateError(String(error.message));
        } else {
            setCreateError('Failed to create area.');
        }
    }
    };

    function handleDeleteArea(id: string) {
        deleteJson(`/api/areas/${id}`)
            .then(() => {
                setAreas(areas.filter((a) => a.id !== id));
            })
            .catch((error) => {
                console.error('Failed to delete area:', error);
            });
    }

    async function handleRenameArea(id: string, newName: string): Promise<string | null> {
        try {
            const updated = await putJsonWithBody<Area>(`/api/areas/${id}`, { name: newName });

            setAreas((prev) =>
                prev.map((a) => a.id === id ? updated : a)
            );

            return null;
        } catch (error) {
            console.error('Failed to rename area:', error);

            if (
                typeof error === 'object' &&
                error !== null &&
                'message' in error
            ) {
                return String(error.message);
            }

            return 'Failed to rename area.';
        }
    }

    return (
        <div className="relative h-screen w-screen overflow-hidden">

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
                onDrawComplete={handleDrawComplete}
                pendingCoordinates={pendingCoordinates}
                onDrawError={(message) => {
                    setDrawError(message);

                    setTimeout(() => {
                        setDrawError(null);
                    }, 3000);
                }}
            />

            {drawError && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] rounded-lg border border-destructive/30 bg-background px-4 py-3 shadow-lg">
                    <p className="text-sm font-medium text-destructive">
                        {drawError}
                    </p>
                </div>
            )}
            
            <Dialog
                open={isNameModalOpen}
                onOpenChange={(open) => {
                    setIsNameModalOpen(open);

                    if (!open) {
                        setPendingCoordinates(null);
                        setAreaName('');
                        setCreateError(null);
                    }
                }}
            >
                <DialogContent className="z-[10000]">
                    <DialogHeader>
                        <DialogTitle>Add area</DialogTitle>
                        <DialogDescription>
                            {t('uniqueAreaPrompt')}
                        </DialogDescription>
                    </DialogHeader>

                    <Input
                        value={areaName}
                        onChange={(event) => {
                            setAreaName(event.target.value);
                            setCreateError(null);
                        }}
                        placeholder={t("areaName")}
                        maxLength={30}
                        autoFocus
                    />

                    {createError && (
                        <p className="text-sm text-destructive">
                            {createError}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {setIsNameModalOpen(false);setPendingCoordinates(null);setAreaName('');setCreateError(null);}}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleCreateArea}
                            disabled={
                                areaName.trim().length === 0 ||
                                areaName.trim().length > 30
                            }
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}