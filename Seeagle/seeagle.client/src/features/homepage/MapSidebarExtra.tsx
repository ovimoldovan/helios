import { Button } from "@/components/ui/button";
import {Plus, X} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/shared/context/AuthContext';

interface MapSidebarExtraProps {
    onNewReport?: () => void;
    isPlacingPin?: boolean;
    onCancelPlacePin?: () => void;
}

export function MapSidebarExtra({ onNewReport, isPlacingPin = false, onCancelPlacePin }: MapSidebarExtraProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
        <div className="space-y-3">
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
                <div className="w-full border-2 border-border rounded-full py-2 text-center text-sm text-muted-foreground">
                    {t('loginToAddReport')}
                </div>
            )}
        </div>
    );
}