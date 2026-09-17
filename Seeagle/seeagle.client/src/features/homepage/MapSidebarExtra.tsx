import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Plus, X} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/shared/context/AuthContext';
import type { Area } from '@/features/admin/types';

interface MapSidebarExtraProps {
    onNewReport?: () => void;
    isPlacingPin?: boolean;
    onCancelPlacePin?: () => void;
    areas?: Area[];
    selectedAreaId?: string | null;
    onAreaChange?: (areaId: string | null) => void;
}

export function MapSidebarExtra({
                                    onNewReport,
                                    isPlacingPin = false,
                                    onCancelPlacePin,
                                    areas,
                                    selectedAreaId,
                                    onAreaChange,
                                }: MapSidebarExtraProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
        <div className="space-y-3">
            {areas && areas.length > 0 && (
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground px-1">
                        {t('filterByArea')}
                    </label>
                    <Select
                        value={selectedAreaId ?? ''}
                        onValueChange={(value) => onAreaChange?.(value === 'all' ? null : value)}
                    >
                        <SelectTrigger className="w-full rounded-full border-2">
                            <SelectValue placeholder={t('allAreas')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allAreas')}</SelectItem>
                            {areas.map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                    {area.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {isAuthenticated ? (
                isPlacingPin ? (
                    <div className="grid grid-cols-2">
                        <Button
                            variant="outline"
                            className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                            disabled
                        >
                            <Plus className="h-4 w-4"/>
                            <span >{t('placing')}</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                            onClick={onCancelPlacePin}
                        >
                            <X className="h-4 w-4"/>
                            <span className="truncate">{t('cancel')}</span>
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                        onClick={onNewReport}
                    >
                        <Plus className="h-4 w-4"/>
                        {t('newReport')}
                    </Button>
                )
            ) : (
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-2 rounded-full h-auto min-h-9 py-2 whitespace-normal text-left"
                    onClick={onNewReport}
                >
                    <Plus className="w-4 h-4" />
                    <span className="leading-tight">{t("loginToAddReport")}</span>
                </Button>
            )}
        </div>
    );
}