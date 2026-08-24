import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import type { ModerationReport } from '@/features/moderator/api/moderationApi';

interface PriorityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (priority: string) => void;
    report: ModerationReport | null;
    isLoading: boolean;
}

export function PriorityModal({
    isOpen,
    onClose,
    onConfirm,
    report,
    isLoading,
}: PriorityModalProps) {
    const [priority, setPriority] = useState('low');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve Report</DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="bg-muted/50 p-3 rounded-lg space-y-1 text-sm">
                        <p>
                            <span className="font-medium">Description:</span>{' '}
                            {report.description ?? 'No description'}
                        </p>
                        <p>
                            <span className="font-medium">Created:</span>{' '}
                            {new Date(report.createdUtc).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className="py-4">
                    <Label htmlFor="priority" className="block mb-2">
                        Priority
                    </Label>
                    <Select
                        value={priority}
                        onValueChange={(value) => {
                            if (value) setPriority(value);
                        }}
                    >
                        <SelectTrigger className="w-full" id="priority">
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">🟢 Low</SelectItem>
                            <SelectItem value="medium">🟡 Medium</SelectItem>
                            <SelectItem value="urgent">🔴 Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={() => onConfirm(priority)} disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Approve'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}