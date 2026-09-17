import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash2, Check, X, Square, Pentagon } from 'lucide-react';
import type { Area } from '../types';
import { Link } from 'react-router-dom';

interface AreasSidePanelProps {
    areas: Area[];
    onDeleteArea: (id: string) => void;
    onRenameArea: (id: string, newName: string) => Promise<string | null>;
    onStartDraw: (mode: 'rectangle' | 'polygon') => void;
}

export function AreasSidePanel({ areas, onDeleteArea, onRenameArea, onStartDraw }: AreasSidePanelProps) {
    return (
        <div className="fixed z-9998 h-dvh bg-background p-4 flex flex-col w-80 left-0 overflow-y-auto shadow-md">
            <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground mb-4"
            >
                ← Back to Home
            </Link>

            <h2 className="text-lg font-bold text-foreground mb-2">Area Management</h2>
            <p className="text-sm text-muted-foreground mb-4">
                Draw shapes on the map to define areas.
            </p>

            <div className="flex gap-2 mb-4">
                <Button
                    size="sm"
                    className="flex-1 flex items-center gap-1.5"
                    onClick={() => onStartDraw('rectangle')}
                >
                    <Square className="h-3.5 w-3.5" /> Rectangle
                </Button>
                <Button
                    size="sm"
                    className="flex-1 flex items-center gap-1.5"
                    onClick={() => onStartDraw('polygon')}
                >
                    <Pentagon className="h-3.5 w-3.5" /> Polygon
                </Button>
            </div>

            <div className="h-px bg-border w-full mb-4" />

            {areas.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                    No areas yet. Use the buttons above to draw one.
                </p>
            )}

            <div className="flex flex-col gap-3">
                {areas.map((area) => (
                    <AreaCard
                        key={area.id}
                        area={area}
                        onDelete={onDeleteArea}
                        onRename={onRenameArea}
                    />
                ))}
            </div>
        </div>
    );
}

function AreaCard({ area, onDelete, onRename }: {
    area: Area;
    onDelete: (id: string) => void;
    onRename: (id: string, newName: string) => Promise<string | null>;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(area.name);
    const [renameError, setRenameError] = useState<string | null>(null);

    async function handleSave() {
        if (tempName.trim().length > 0 && tempName.trim().length <= 30) {
            const error = await onRename(area.id, tempName.trim());

            if (error) {
                setRenameError(error);
                return;
            }

            setRenameError(null);
            setIsEditing(false);
        }
    }

    return (
        <Card className="shadow-sm">
            <CardContent className="p-3">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <Input
                            value={tempName}
                            onChange={(e) => {
                                setTempName(e.target.value);
                                setRenameError(null);
                            }}
                            maxLength={30}
                            className="h-8 text-sm"
                            autoFocus
                        />
                        
                        {renameError && (
                            <p className="text-xs text-destructive">
                                {renameError}
                            </p>
                        )}
                        
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {setTempName(area.name);setRenameError(null);setIsEditing(false);}}
                                className="h-7 text-xs px-2 flex items-center gap-1"
                            >
                                <X className="h-3 w-3" /> Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                className="h-7 text-xs px-2 flex items-center gap-1"
                            >
                                <Check className="h-3 w-3" /> Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-foreground text-sm truncate pr-2">
                                {area.name}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-accent flex items-center gap-1"
                                onClick={() => setIsEditing(true)}
                            >
                                <Pencil className="h-3 w-3" /> Rename
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-1"
                                onClick={() => onDelete(area.id)}
                            >
                                <Trash2 className="h-3 w-3" /> Delete
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}