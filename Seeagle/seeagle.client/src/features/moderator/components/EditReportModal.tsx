import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import type { ModerationReport, UpdateReportRequest } from '../api/moderationApi';
import { PRIORITY_COLORS } from '@/shared/constants/reportColors';

interface EditReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: ModerationReport | null;
    onSave: (id: string, data: UpdateReportRequest) => Promise<void>;
    isSaving?: boolean;
}

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'priorityLow' },
    { value: 'medium', label: 'priorityMedium' },
    { value: 'urgent', label: 'priorityUrgent' },
];

export function EditReportModal({isOpen, onClose, report, onSave, isSaving = false,}: EditReportModalProps) {
    const { t } = useTranslation();

    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!report) return;
        setDescription(report.description || '');
        setPriority(report.priority || 'low');
        setError(null);
    }, [report]);

    const handleSubmit = async () => {
        if (!report) return;

        if (description.length > 255) {
            setError(t('descriptionTooLong'));
            return;
        }

        try {
            await onSave(report.id, {
                description: description.trim() || null,
                priority,
            });
            onClose();
        } catch {
            setError(t('unexpectedErrorUpdatingReport'));
        }
    };

    const getColor = (value: string) => {
        return PRIORITY_COLORS[value] || PRIORITY_COLORS.low;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('editReport')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>{t('priority')}</Label>
                        <Select
                            value={priority}
                            onValueChange={(value) => value && setPriority(value)}
                            disabled={isSaving}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('selectPriority')} />
                            </SelectTrigger>
                            <SelectContent>
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getColor(opt.value) }}
                                            />
                                            {t(opt.label)}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {t('description')}
                            <span className="text-xs text-muted-foreground ml-1">
                                ({t('optional')})
                            </span>
                        </Label>
                        <Textarea
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setError(null);
                            }}
                            maxLength={255}
                            className="min-h-[100px]"
                            disabled={isSaving}
                        />
                        <p className="text-right text-xs text-muted-foreground">
                            {description.length}/255
                        </p>
                    </div>
                    {error && (
                        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? t('saving') : t('saveChanges')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}