import { useEffect, useRef, useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createReport, getActiveReportTypes } from '@/features/reports/api/reportApi.ts';
import type { Report, ReportType } from '@/shared/types/report';
import { useTranslation } from 'react-i18next';
import { Spinner } from "@/components/ui/spinner";

const PAGE_SIZE = 20;

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

    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [reportTypePage, setReportTypePage] = useState(1);
    const [reportTypeTotalCount, setReportTypeTotalCount] = useState(0);
    const [reportTypesLoading, setReportTypesLoading] = useState(false);
    const [selectedReportTypeId, setSelectedReportTypeId] = useState<string | null>(null);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const selectedReportType = reportTypes.find((rt) => rt.id === selectedReportTypeId);


    const { t } = useTranslation();

    const hasMoreReportTypes = reportTypes.length < reportTypeTotalCount;

    function fetchReportTypes(targetPage: number) {
        setReportTypesLoading(true);

        getActiveReportTypes(targetPage, PAGE_SIZE)
            .then((result) => {
                setReportTypes((prev) => (targetPage === 1 ? result.items : [...prev, ...result.items]));
                setReportTypeTotalCount(result.totalCount);
                setReportTypePage(targetPage);
            })
            .catch(() => setError(t('unexpectedErrorLoadingReportTypes')))
            .finally(() => setReportTypesLoading(false));
    }

    useEffect(() => {
        if (isOpen) {
            fetchReportTypes(1);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isSelectOpen) return;

        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreReportTypes && !reportTypesLoading) {
                fetchReportTypes(reportTypePage + 1);
            }
        });

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [isSelectOpen, hasMoreReportTypes, reportTypesLoading, reportTypePage]);

    const handleClose = () => {
        setDescription('');
        setError(null);
        setSelectedReportTypeId(null);
        setReportTypes([]);
        setReportTypePage(1);
        setReportTypeTotalCount(0);
        onClose();
    };

    const handleSubmit = async () => {
        if (!pinPosition) {
            setError(t('placePinFirst'));
            return;
        }

        if (!selectedReportTypeId) {
            setError(t('selectReportTypeFirst'));
            return;
        }

        if (description.length > 255) {
            setError(t('descriptionTooLong'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const report = await createReport({
                longitude: pinPosition[1],
                latitude: pinPosition[0],
                description: description.trim() || null,
                reportTypeId: selectedReportTypeId,
            });
            onReportCreated(report);
            handleClose();
        } catch {
            setError(t('failedToSubmitReport'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('newReport')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>{t('location')}</Label>
                        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600 border border-gray-200">
                            {pinPosition ? (
                                ` ${pinPosition[0].toFixed(4)}° N, ${pinPosition[1].toFixed(4)}° E`
                            ) : (
                                t('tapMapToPlacePin')
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Select
                            value={selectedReportTypeId ?? undefined}
                            onValueChange={setSelectedReportTypeId}
                            onOpenChange={setIsSelectOpen}
                        >
                            <SelectTrigger id="reportType" className="w-full">
                                <SelectValue placeholder={t('reportType')}>
                                    {selectedReportType?.name}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={false}>
                                {reportTypes.map((reportType) => (
                                    <SelectItem key={reportType.id} value={reportType.id}>
                                        {reportType.name}
                                    </SelectItem>
                                ))}
                                <div ref={sentinelRef} className="h-1" />
                                {reportTypesLoading && (
                                    <div className="flex justify-center items-center">
                                        <Spinner className="size-6"/>
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t('description')} <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
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
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !pinPosition || !selectedReportTypeId}>
                        {isSubmitting ? t('submitting') : t('submitReport')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}