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
import { useEffect, useState } from 'react';
import type { ModerationReport } from '@/features/moderator/api/moderationApi';
import { useTranslation } from 'react-i18next';

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string | null) => void;
    report: ModerationReport | null;
    isLoading: boolean;
}

export function RejectModal({ isOpen, onClose, onConfirm, report, isLoading }: RejectModalProps) {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm(message.trim() || null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('rejectReport')}</DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                        <p className="line-clamp-2">
                            {report.description ?? t('noDescription')}
                        </p>
                    </div>
                )}

                <div className="space-y-2 py-2">
                    <Label htmlFor="rejectMessage">{t('messageToReporter')}</Label>
                    <Textarea
                        id="rejectMessage"
                        placeholder={t('writeMessagePlaceholder')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px]"
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                        {message.length}/500
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? t('processing') : t('reject')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}