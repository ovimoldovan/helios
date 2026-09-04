import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/shared/context/AuthContext';

interface MapSidebarExtraProps {
    onNewReport?: () => void;
    isPlacingPin?: boolean;
}

export function MapSidebarExtra({ onNewReport}: MapSidebarExtraProps) {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    return (
        <div className="p-4 space-y-4">
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