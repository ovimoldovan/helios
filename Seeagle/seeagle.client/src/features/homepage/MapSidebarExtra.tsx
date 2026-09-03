import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/shared/context/AuthContext';

interface MapSidebarExtraProps {
    onNewReport?: () => void;
    isPlacingPin?: boolean;
}

export function MapSidebarExtra({ onNewReport, isPlacingPin = false }: MapSidebarExtraProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
        <div className="p-4 space-y-4 border-t border-border">
            <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Seeagle
                </p>
                <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="font-medium text-sm">
                            {isPlacingPin ? t("placingPin") : t("addReport")}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                            {isPlacingPin ? t("clickMapToDrop") : t("tapMapToPlacePin")}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-3">
                {isAuthenticated ? (
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-2 rounded-full"
                        onClick={onNewReport}
                    >
                        <Plus className="w-4 h-4" />
                        {t("newReport")}
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 border-2 rounded-full"
                        onClick={onNewReport}
                    >
                        <Plus className="w-4 h-4" />
                        {t("loginToAddReport")}
                    </Button>
                )}
            </div>
        </div>
    );
}