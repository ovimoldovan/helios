import { useEffect, useState } from 'react';
import { getJson } from '@/shared/api/httpClient';
import { getCookie } from '@/shared/utils/cookies'; 
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
import { LeftPanel } from "@/features/homepage/components/LeftPanel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Area } from "@/features/admin/types.ts";

const PAGE_SIZE = 10;

export function PublicReports() {
    const { t } = useTranslation();
    const [reports, setReports] = useState<Report[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [areas, setAreas] = useState<Area[]>([]);
    const [areaFilter, setAreaFilter] = useState<string>('all');

    useEffect(() => {
        const loadAreas = async () => {
            try {
                const token = getCookie('authToken'); 
                const data = await getJson<Area[]>('/api/areas', token ?? undefined);
                setAreas(data);
            } catch (error) {
                console.error('Failed to load areas:', error);
            }
        };
        loadAreas();
    }, []);

    useEffect(() => {
        loadReports();
    }, [page, statusFilter, sortOrder, areaFilter]);

    const loadReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getCookie('authToken'); 

            const url = new URL('/api/reports/public', window.location.origin);
            url.searchParams.set('pageNumber', String(page));
            url.searchParams.set('pageSize', String(PAGE_SIZE));

            if (statusFilter !== 'all') {
                url.searchParams.set('status', statusFilter);
            }

            if (areaFilter !== 'all') {
                url.searchParams.set('areaId', areaFilter);
            }

            url.searchParams.set('sortBy', 'createdUtc');
            url.searchParams.set('sortOrder', sortOrder);

            const result = await getJson<PagedResult<Report>>(
                url.toString(),
                token ?? undefined 
            );
            setReports(result.items);
            setTotalCount(result.totalCount);
        } catch {
            setError(t('unexpectedErrorLoadingReports'));
        } finally {
            setIsLoading(false);
        }
    };

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

    const toggleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setPage(1);
    };

    const handleStatusChange = (value: string | null) => {
        if (value) {
            setStatusFilter(value);
            setPage(1);
        }
    };

    const handleAreaChange = (value: string | null) => {
        if (value) {
            setAreaFilter(value);
            setPage(1);
        }
    };

    return (
        <div className="flex">
            <LeftPanel />
            <main className="flex-1 relative min-h-screen overflow-y-auto bg-muted p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h1 className="text-xl font-semibold">{t('publicReports')}</h1>

                        <div className="flex items-center gap-4 flex-wrap">
                            <Select
                                value={areaFilter}
                                onValueChange={handleAreaChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('filterByArea')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('allAreas')}</SelectItem>
                                    {areas.map((area) => (
                                        <SelectItem key={area.id} value={area.id}>
                                            {area.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={statusFilter}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('filterByStatus')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('all')}</SelectItem>
                                    <SelectItem value="Approved">{t('approved')}</SelectItem>
                                    <SelectItem value="Solved">{t('solved')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                                            <TableHead>{t('status')}</TableHead>
                                            <TableHead>{t('priority')}</TableHead>
                                            <TableHead>
                                                <button
                                                    className="flex items-center gap-1 hover:text-foreground"
                                                    onClick={toggleSort}
                                                >
                                                    {t('created')}
                                                    <span className="text-xs">
                                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                                    </span>
                                                </button>
                                            </TableHead>
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
        </div>
    );
}