import { useEffect, useState } from 'react';
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
import { updateReportType } from '@/features/admin/api/adminApi';
import type { ReportType } from '@/shared/types/report';
import { useTranslation } from 'react-i18next';
import { getCookie } from '@/shared/utils/cookies';

interface EditReportTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportType: ReportType | null;
    onReportTypeUpdated: (reportType: ReportType) => void;
}

export function EditReportTypeModal({
    isOpen,
    onClose,
    reportType,
    onReportTypeUpdated,
}: EditReportTypeModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (reportType) {
            setName(reportType.name);
            setError(null);
        }
    }, [reportType, isOpen]);

    const handleClose = () => {
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!reportType) return;

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
            const updatedReportType = await updateReportType(reportType.id, trimmedName, token!);
            onReportTypeUpdated(updatedReportType);
            handleClose();
        } catch (err: unknown) {
            if (err instanceof Error && err.message === 'This report type already exists.') {
                setError(t('reportTypeAlreadyExists'));
            } else {
                setError(t('unexpectedErrorUpdatingReportType'));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('editReportType')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-report-type-name">
                            {t('reportTypeNamePlaceholder')}
                        </Label>
                        <Input
                            id="edit-report-type-name"
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
                        {isSubmitting ? t('saving') : t('save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
