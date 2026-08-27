import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { ModerationReport } from '@/features/moderator/api/moderationApi';
import { Check, AlertTriangle, CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Priority } from "./models/Priority";

interface PriorityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (priority: Priority) => void;
    report: ModerationReport | null;
    isLoading: boolean;
}

export function PriorityModal({isOpen, onClose, onConfirm, report, isLoading,}: PriorityModalProps) {
    const { t } = useTranslation();
    const [priority, setPriority] = useState<Priority>(Priority.Low);

    const priorities = [
        {
            value: Priority.Low,
            label: t('priorityLow'),
            description: t('priorityLowDescription'),
            icon: Check,
            active: 'border-green-500 bg-green-50 text-green-700',
        },
        {
            value: Priority.Medium,
            label: t('priorityMedium'),
            description: t('priorityMediumDescription'),
            icon: AlertTriangle,
            active: 'border-yellow-500 bg-yellow-50 text-yellow-700',
        },
        {
            value: Priority.Urgent,
            label: t('priorityUrgent'),
            description: t('priorityUrgentDescription'),
            icon: CircleAlert,
            active: 'border-red-500 bg-red-50 text-red-700',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('approveReport')}</DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                        <p className="text-sm font-semibold">{t('report')}</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {report.description ?? t('noDescription')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(report.createdUtc).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <div>
                        <p className="text-sm font-semibold">{t('setPriority')}</p>
                        <p className="text-xs text-muted-foreground">
                            {t('setPriorityDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {priorities.map((p) => {
                            const Icon = p.icon;
                            const selected = priority === p.value;

                            return (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`
                                        flex flex-col items-center gap-2
                                        rounded-xl border-2 p-4
                                        transition-all
                                        ${selected
                                        ? p.active
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                    `}
                                >
                                    <Icon className="h-6 w-6" />
                                    <div className="text-center">
                                        <p className="text-sm font-semibold">{p.label}</p>
                                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                                            {p.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter className="pt-3">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={() => onConfirm(priority)} disabled={isLoading}>
                        {isLoading ? t('processing') : t('approveReportButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}