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

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (message: string | null, markAsSolved: boolean) => void;  // ← Schimbat
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
    const [message, setMessage] = useState('');
    const [markAsSolved, setMarkAsSolved] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setMarkAsSolved(false);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm(message.trim() || null, markAsSolved);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Action on Report</DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                        <p className="line-clamp-2">
                            {report.description ?? 'No description'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Priority: <span className="font-medium">{report.priority}</span>
                        </p>
                    </div>
                )}

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="message">Message to reporter (optional)</Label>
                        <Textarea
                            id="message"
                            placeholder="Write a message to the reporter..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[100px]"
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {message.length}/500
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="markAsSolved"
                            checked={markAsSolved}
                            onChange={(e) => setMarkAsSolved(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="markAsSolved" className="cursor-pointer">
                            Mark as solved
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Apply Action'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}