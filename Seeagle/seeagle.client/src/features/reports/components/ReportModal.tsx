import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createReport } from '@/features/reports/api/reportApi.ts';
import type { Report } from '@/shared/types/report';
import { useTranslation } from 'react-i18next';

interface AddReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReportCreated: (report: Report) => void;
    pinPosition: [number, number] | null;
}

export function AddReportModal({
    isOpen,
    onClose,
    onReportCreated,
    pinPosition 
}: AddReportModalProps) {
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setDescription('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!pinPosition) {
            setError(t('placePinFirst'));
            return;
        }

        if (description.length > 255) {
            setError(t('descriptionTooLong'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const report = await createReport({
                longitude: pinPosition[1], 
                latitude: pinPosition[0],
                description: description.trim() || null,
            });
            onReportCreated(report);
            handleClose();
        } catch {
            setError(t('failedToSubmitReport'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('newReport')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>{t('location')}</Label>
                        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600 border border-gray-200">
                            {pinPosition ? (
                                ` ${pinPosition[0].toFixed(4)}° N, ${pinPosition[1].toFixed(4)}° E`
                            ) : (
                                t('tapMapToPlacePin')
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t('description')} <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={255}
                            className="min-h-[100px]"
                        />
                        <div className="text-right text-xs text-gray-400">
                            {description.length}/255
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !pinPosition}>
                        {isSubmitting ? t('submitting') : t('submitReport')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
