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

export function EditReportModal({isOpen, onClose, report, onSave, isSaving = false,}: EditReportModalProps) {
    const { t } = useTranslation();
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<string>('low');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (report) {
            setDescription(report.description || '');
            setPriority(report.priority || 'low');
            setError(null);
        }
    }, [report]);

    const handleSubmit = async () => {
        if (!report) return;

        setError(null);

        if (description.length > 255) {
            setError(t('descriptionTooLong'));
            return;
        }

        const updateData: UpdateReportRequest = {
            description: description.trim() || null,
            priority: priority,
        };

        try {
            await onSave(report.id, updateData);
            onClose();
        } catch {
            setError(t('unexpectedErrorUpdatingReport'));
        }
    };

    const getPriorityColor = (value: string) => {
        return PRIORITY_COLORS[value?.toLowerCase()] || PRIORITY_COLORS.low;
    };

    const handlePriorityChange = (value: string | null) => {
        if (value) {
            setPriority(value);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('editReport')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-priority">{t('priority')}</Label>
                        <Select
                            value={priority}
                            onValueChange={handlePriorityChange}
                            disabled={isSaving}
                        >
                            <SelectTrigger id="edit-priority">
                                <SelectValue placeholder={t('selectPriority')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full inline-block"
                                            style={{ backgroundColor: getPriorityColor('low') }}
                                        />
                                        {t('priorityLow')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full inline-block"
                                            style={{ backgroundColor: getPriorityColor('medium') }}
                                        />
                                        {t('priorityMedium')}
                                    </div>
                                </SelectItem>
                                <SelectItem value="urgent">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-3 h-3 rounded-full inline-block"
                                            style={{ backgroundColor: getPriorityColor('urgent') }}
                                        />
                                        {t('priorityUrgent')}
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">
                            {t('description')} <span className="text-muted-foreground text-xs">({t('optional')})</span>
                        </Label>
                        <Textarea
                            id="edit-description"
                            placeholder={t('descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setError(null);
                            }}
                            maxLength={255}
                            className="min-h-[100px]"
                            disabled={isSaving}
                        />
                        <div className="text-right text-xs text-muted-foreground">
                            {description.length}/255
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
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