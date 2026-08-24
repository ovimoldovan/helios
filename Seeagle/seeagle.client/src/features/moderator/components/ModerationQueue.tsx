import { useEffect, useState } from 'react';
import {
    approveReport,
    getPendingReports,
    rejectReport,
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
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriorityModal } from './PriorityModal';

const PAGE_SIZE = 10;

export function ModerationQueue() {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ModerationReport | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getPendingReports(page, PAGE_SIZE)
            .then((result) => {
                setReports(result.items);
                setTotalCount(result.totalCount);
            })
            .catch(() => setError('Unexpected error while loading reports.'))
            .finally(() => setIsLoading(false));
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const handleApprove = (report: ModerationReport) => {
        setSelectedReportId(report.id);
        setSelectedReport(report);
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedReportId(null);
        setSelectedReport(null);
    };
    const handleConfirmApprove = async (priority: string) => {
        if (!selectedReportId) return;

        setIsProcessing(true);

        try {
            const token = getAuthToken();
            await approveReport(selectedReportId, priority, token ?? undefined);

            setReports((currentReports) =>
                currentReports.filter((report) => report.id !== selectedReportId)
            );

            setTotalCount((currentCount) => Math.max(0, currentCount - 1));
            setModalOpen(false);
            setSelectedReportId(null);
        } catch {
            setError('Unexpected error while approving report.');
        } finally {
            setIsProcessing(false);
        }
    };

    async function handleReject(id: string) {
        try {
            const token = getAuthToken();

            await rejectReport(id, token ?? undefined);

            setReports((currentReports) =>
                currentReports.filter((report) => report.id !== id)
            );

            setTotalCount((currentCount) => Math.max(0, currentCount - 1));
        } catch {
            setError('Unexpected error while rejecting report.');
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">
                Moderation Queue
            </h1>

            {isLoading && <p>Loading reports...</p>}

            {error && (
                <p className="text-red-600">
                    {error}
                </p>
            )}

            {!isLoading && !error && (
                <>
                    {reports.length === 0 ? (
                        <p className="text-muted-foreground">
                            No pending reports.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="py-2">
                                            {report.description ?? 'No description'}
                                        </TableCell>

                                        <TableCell className="py-2">
                                            {new Date(report.createdUtc).toLocaleString()}
                                        </TableCell>

                                        <TableCell className="py-2">
                                            {report.status}
                                        </TableCell>

                                        <TableCell className="py-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => void handleApprove(report)}
                                                >
                                                    Approve
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => void handleReject(report.id)}
                                                >
                                                    Reject
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
                            className={
                                page === 1
                                    ? 'cursor-not-allowed opacity-50'
                                    : undefined
                            }
                            onClick={(e) => {
                                e.preventDefault();

                                if (page > 1) {
                                    setPage(page - 1);
                                }
                            }}
                        >
                            <ChevronLeftIcon />
                        </PaginationLink>

                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>

                        <PaginationLink
                            href="#"
                            size="icon"
                            aria-label="Next"
                            aria-disabled={page === totalPages}
                            className={
                                page === totalPages
                                    ? 'cursor-not-allowed opacity-50'
                                    : undefined
                            }
                            onClick={(e) => {
                                e.preventDefault();

                                if (page < totalPages) {
                                    setPage(page + 1);
                                }
                            }}
                        >
                            <ChevronRightIcon />
                        </PaginationLink>
                    </div>
                </>
            )}
            <PriorityModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onConfirm={handleConfirmApprove}
                report={selectedReport}
                isLoading={isProcessing}
            />
        </div>
    );
}