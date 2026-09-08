import { useEffect, useState } from 'react';
import { getMyReports } from '@/features/reports/api/reportApi';
import type { Report } from '@/shared/types/report';
import type { PagedResult } from '@/shared/types/pagedResult';
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
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/shared/context/AuthContext';

const PAGE_SIZE = 10;

export function MyReports() {
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        getMyReports(page, PAGE_SIZE)
            .then((result: PagedResult<Report>) => {
                setReports(result.items);
                setTotalCount(result.totalCount);
            })
            .catch(() => setError(t('unexpectedErrorLoadingReports')))
            .finally(() => setIsLoading(false));
    }, [page, isAuthenticated, t]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const statusBadge = (status: string) => {
        const config: Record<string, string> = {
            Pending: 'bg-yellow-100 text-yellow-700',
            Approved: 'bg-green-100 text-green-700',
            Rejected: 'bg-red-100 text-red-700',
            Solved: 'bg-blue-100 text-blue-700',
        };
        return config[status] || 'bg-gray-100 text-gray-700';
    };

    if (!isAuthenticated) {
        return (
                <main className="flex-1 p-6">
                    <p className="text-muted-foreground text-center">{t('loginToViewReports')}</p>
                </main>
        );
    }

    return (
            <main className="flex-1 relative min-h-screen overflow-y-auto bg-muted p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <h1 className="text-xl font-semibold mb-4">{t('myReports')}</h1>

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
                                            <TableHead>{t('status')}</TableHead>
                                            <TableHead>{t('priority')}</TableHead>
                                            <TableHead>{t('created')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="py-2">
                                                    {report.description ?? t('noDescription')}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    {report.priority || '-'}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    {new Date(report.createdUtc).toLocaleString()}
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
                </div>
            </main>
    );
}