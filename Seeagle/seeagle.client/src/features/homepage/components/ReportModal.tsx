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
import { createReport } from '@/shared/api/reportApi';
import type { Report } from '@/shared/types/report';

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
            setError('Place a pin on the map first.');
            return;
        }

        if (description.length > 255) {
            setError('Description must be 255 characters or less.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const report = await createReport({
                latitude: pinPosition[0],
                longitude: pinPosition[1],
                description: description.trim() || null,
            });
            onReportCreated(report);
            handleClose();
        } catch {
            setError('Failed to submit report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New report</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600 border border-gray-200">
                            {pinPosition ? (
                                ` ${pinPosition[0].toFixed(4)}° N, ${pinPosition[1].toFixed(4)}° E`
                            ) : (
                                'Tap map to place a pin'
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what you saw..."
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
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !pinPosition}>
                        {isSubmitting ? 'Submitting...' : 'Submit report'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
