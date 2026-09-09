import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createReportType } from '@/features/admin/api/adminApi';
import type { ReportType } from '@/shared/types/report';
import { useTranslation } from 'react-i18next';
import { getCookie } from '@/shared/utils/cookies';

interface AddReportTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReportTypeCreated: (reportType: ReportType) => void;
}

export function AddReportTypeModal({
    isOpen,
    onClose,
    onReportTypeCreated,
}: AddReportTypeModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleClose = () => {
        setName('');
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            setError(t('reportTypeNameRequired'));
            return;
        }

        if (trimmedName.length > 20) {
            setError(t('maximum20Characters'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const token = getCookie('authToken');
            const newReportType = await createReportType(trimmedName, token!);
            onReportTypeCreated(newReportType);
            handleClose();
        } catch (err: unknown) {
            if (err instanceof Error && err.message === 'This report type already exists.') {
                setError(t('reportTypeAlreadyExists'));
            } else {
                setError(t('unexpectedErrorAddingReportType'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('newReportType', 'New Report Type')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="report-type-name">
                            {t('reportTypeNamePlaceholder')}
                        </Label>
                        <Input
                            id="report-type-name"
                            placeholder={t('reportTypeNamePlaceholder')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={20}
                        />
                        <div className="text-right text-xs text-gray-400">
                            {name.length}/20
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
                    <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
                        {isSubmitting ? t('adding') : t('add')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
