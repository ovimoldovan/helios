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
import { useState, useEffect } from 'react';
import type { ModerationReport } from '@/features/moderator/api/moderationApi';
import { useTranslation } from 'react-i18next';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string | null, markAsSolved: boolean) => Promise<void>;
    report: ModerationReport | null;
    isLoading: boolean;
}

export function ActionModal({
                                isOpen,
                                onClose,
                                onConfirm,
                                report,
                                isLoading,
                            }: ActionModalProps) {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    const [markAsSolved, setMarkAsSolved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setMarkAsSolved(false);
        }
    }, [isOpen]);
    
    useEffect(() => {
        setError(null);
    }, [message])

    const handleConfirm = async () => {
        setError(null);
        await onConfirm(message.trim() || null, markAsSolved);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('actionOnReport')}</DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                        <p className="line-clamp-2">
                            {report.description ?? t('noDescription')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {t('priority')}: <span className="font-medium">{report.priority}</span>
                        </p>
                    </div>
                )}

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="message">{t('messageToReporter')}</Label>
                        <Textarea
                            id="message"
                            placeholder={t('writeMessagePlaceholder')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                            maxLength={500}
                        />
                        <p
                            className={`text-xs text-right ${
                                !(markAsSolved ? (message.length == 0 || message.length >= 3) : message.length >= 3) ? 'text-destructive' : 'text-muted-foreground'
                            }`}
                        >
                            {message.length}/500
                        </p>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="markAsSolved"
                            checked={markAsSolved}
                            onChange={(e) => setMarkAsSolved(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="markAsSolved" className="cursor-pointer">
                            {t('markAsSolved')}
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleConfirm} disabled={isLoading || !(markAsSolved ? (message.length == 0 || message.length >= 3) : message.length >= 3)}>
                        {isLoading ? t('processing') : t('applyAction')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}