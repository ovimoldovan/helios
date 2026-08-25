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
import { useTranslation } from 'react-i18next';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';
const PAGE_SIZE = 10;

export function ModerationQueue() {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getPendingReports(page, PAGE_SIZE)
            .then((result) => {
                setReports(result.items);
                setTotalCount(result.totalCount);
            })
            .catch(() => setError(t('errorLoadingReports')))
            .finally(() => setIsLoading(false));
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    async function handleApprove(id: string) {
        try {
            const token = getAuthToken();

            await approveReport(id, token ?? undefined);

            setReports((currentReports) =>
                currentReports.filter((report) => report.id !== id)
            );

            setTotalCount((currentCount) => Math.max(0, currentCount - 1));
        } catch {
            setError(t('errorWhileApprovingReport'));
        }
    }

    async function handleReject(id: string) {
        try {
            const token = getAuthToken();

            await rejectReport(id, token ?? undefined);

            setReports((currentReports) =>
                currentReports.filter((report) => report.id !== id)
            );

            setTotalCount((currentCount) => Math.max(0, currentCount - 1));
        } catch {
            setError(t('errorWhileRejectingReport'));
        }
    }

    return (
        <div className="flex">
            <LeftPanel />
            <div className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-4">
                    {t('moderationQueueTitle')}
                </h1>

                {isLoading && <p>{t('loadingReports')}</p>}

                {error && (
                    <p className="text-red-600">
                        {error}
                    </p>
                )}

                {!isLoading && !error && (
                    <>
                        {reports.length === 0 ? (
                            <p className="text-muted-foreground">
                                {t('noPendingReports')}
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('descriptionColumn')}</TableHead>
                                        <TableHead>{t('createdColumn')}</TableHead>
                                        <TableHead>{t('statusColumn')}</TableHead>
                                        <TableHead>{t('actionColumn')}</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell className="py-2">
                                                {report.description ?? t('noDescription')}
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
                                                        onClick={() => void handleApprove(report.id)}
                                                    >
                                                        {t('approve')}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => void handleReject(report.id)}
                                                    >
                                                        {t('reject')}
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
                                {t('pageOf', { page, totalPages })}
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
            </div>
        </div>
    );
}