import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { ModerationReport } from '@/features/moderator/api/moderationApi';
import { Check, AlertTriangle, CircleAlert } from 'lucide-react';

interface PriorityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (priority: string) => void;
    report: ModerationReport | null;
    isLoading: boolean;
}

export function PriorityModal({ isOpen, onClose, onConfirm, report, isLoading,}: PriorityModalProps) {
    const [priority, setPriority] = useState('low');
    
    const priorities = [
        {
            value: 'low',
            label: 'Low',
            description: 'Other',
            icon: Check,
            active: 'border-green-500 bg-green-50 text-green-700',
        },
        {
            value: 'medium',
            label: 'Medium',
            description: 'Review soon',
            icon: AlertTriangle,
            active: 'border-yellow-500 bg-yellow-50 text-yellow-700',
        },
        {
            value: 'urgent',
            label: 'Urgent',
            description: 'Immediate attention',
            icon: CircleAlert,
            active: 'border-red-500 bg-red-50 text-red-700',
        },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px]">

                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Approve 
                    </DialogTitle>
                </DialogHeader>

                {report && (
                    <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                        <p className="text-sm font-semibold">Report</p>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {report.description ?? 'No description'}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {new Date(report.createdUtc).toLocaleString()}
                        </p>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <div>
                        <p className="text-sm font-semibold">
                            Set priority
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Choose how urgently this report should be handled.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {priorities.map((p) => {
                            const Icon = p.icon;
                            const selected = priority === p.value;

                            return (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 ${
                                        selected
                                            ? p.active
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />

                                    <p className="text-sm font-semibold">{p.label}</p>
                                    <p className="text-xs text-muted-foreground">{p.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter className="pt-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={() => onConfirm(priority)}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Approve Report'}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}