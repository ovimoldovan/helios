import { useEffect, useState } from 'react';
import {
    getAllReportsExceptPending,
    getReportsByStatus,
    deleteReport,
    markAsSolved,
    sendMessageToReporter,
    type ModerationReport,
} from '@/features/moderator/api/moderationApi';
import { getAuthToken } from '@/shared/auth/getAuthToken';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginationLink } from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActionModal } from './ActionModal';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['All', 'Approved', 'Rejected', 'Solved'];

export function ApprovedReports() {
    const { t } = useTranslation();
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const request = statusFilter === 'All'
            ? getAllReportsExceptPending(page, PAGE_SIZE)
            : getReportsByStatus(statusFilter, page, PAGE_SIZE);
        request
            .then((result) => {
                setReports(result.items);
                setTotalCount(result.totalCount);
            })
            .catch(() => setError(t('errorLoadingReports')))
            .finally(() => setIsLoading(false));
    }, [page, statusFilter, t]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    function handleFilterChange(status: string) {
        setStatusFilter(status);
        setPage(1);
    }

    const handleActionClick = (report: ModerationReport) => {
        setSelectedReport(report);
        setModalOpen(true);
    };

    const handleConfirmAction = async (message: string | null, shouldMarkAsSolved: boolean) => {
        if (!selectedReport) return;

        setIsProcessing(true);

        try {
            const token = getAuthToken();
            if (shouldMarkAsSolved) {
                await markAsSolved(selectedReport.id, message, token ?? undefined);
            } else {
                await sendMessageToReporter(selectedReport.id, message, token ?? undefined);
            }

            if (shouldMarkAsSolved) {
                setReports((current) => current.filter((r) => r.id !== selectedReport.id));
                setTotalCount((current) => Math.max(0, current - 1));
            }

            setModalOpen(false);
            setSelectedReport(null);
        } catch {
            setError(t('unexpectedErrorProcessingAction'));
        } finally {
            setIsProcessing(false);
        }
    };

    async function handleDelete(id: string) {
        setDeletingId(id);
        try {
            const token = getAuthToken();
            await deleteReport(id, token ?? undefined);

            setReports((current) => current.filter((report) => report.id !== id));
            setTotalCount((current) => Math.max(0, current - 1));
        } catch {
            setError(t('errorWhileDeletingReport'));
        } finally {
            setDeletingId(null);
        }
    }

    const priorityBadge = (priority: string) => {
        const config = {
            Urgent: 'bg-red-100 text-red-700',
            Medium: 'bg-yellow-100 text-yellow-700',
            Low: 'bg-green-100 text-green-700',
        };
        return config[priority as keyof typeof config] || config.Low;
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">{t('allReportsTitle')}</h1>

            <div className="flex gap-2 mb-4">
                {STATUS_OPTIONS.map((status) => (
                    <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? 'default' : 'outline'}
                        onClick={() => handleFilterChange(status)}
                    >
                        {t(`status_${status}`)}
                    </Button>
                ))}
            </div>

            {isLoading && <p>{t('loadingReports')}</p>}

            {error && <p className="text-red-600">{error}</p>}

            {!isLoading && !error && (
                <>
                    {reports.length === 0 ? (
                        <p className="text-muted-foreground">{t('noReports')}</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('description')}</TableHead>
                                    <TableHead>{t('priority')}</TableHead>
                                    <TableHead>{t('created')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('action')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="py-2">
                                            {report.description ?? t('noDescription')}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityBadge(report.priority)}`}>
                                                {report.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            {new Date(report.createdUtc).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            {report.status}
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <div className="flex gap-2 item">
                                                {report.status == 'Approved' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleActionClick(report)}
                                                    >
                                                        {t('action')}
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    disabled={deletingId === report.id}
                                                    onClick={() => void handleDelete(report.id)}
                                                    aria-label={t('deleteReport')}
                                                >
                                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <div className="flex items-center justify-between gap-4 mt-4">
                        <PaginationLink
                            href="#"
                            size="icon"
                            aria-label="Previous"
                            aria-disabled={page === 1}
                            className={page === 1 ? 'cursor-not-allowed opacity-50' : undefined}
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) setPage(page - 1);
                            }}
                        >
                            <ChevronLeftIcon />
                        </PaginationLink>
                        <span className="text-sm">
                            {t('page')} {page} {t('of')} {totalPages}
                        </span>
                        <PaginationLink
                            href="#"
                            size="icon"
                            aria-label="Next"
                            aria-disabled={page === totalPages}
                            className={page === totalPages ? 'cursor-not-allowed opacity-50' : undefined}
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) setPage(page + 1);
                            }}
                        >
                            <ChevronRightIcon />
                        </PaginationLink>
                    </div>
                </>
            )}

            <ActionModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedReport(null);
                }}
                onConfirm={handleConfirmAction}
                report={selectedReport}
                isLoading={isProcessing}
            />
        </div>
    );
}