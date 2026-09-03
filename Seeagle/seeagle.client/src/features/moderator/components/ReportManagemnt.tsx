import { useEffect, useState } from 'react';
import {
    getAllReports,
    updateReport,
    type ModerationReport,
    type UpdateReportRequest,
} from '@/features/moderator/api/moderationApi';
import { getAuthToken } from '@/shared/auth/getAuthToken';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import { PaginationLink } from '@/components/ui/pagination';
import { ChevronLeftIcon, ChevronRightIcon, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditReportModal } from './EditReportModal';
import { useTranslation } from 'react-i18next';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';
import { useNavigate } from 'react-router-dom';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/shared/constants/reportColors';

const PAGE_SIZE = 10;
type SortField = 'createdUtc' | 'priority' | 'status';

const Badge = ({ color, text }: { color: string; text: string }) => (
    <span
        style={{
            backgroundColor: `${color}20`,
            color: color,
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500',
        }}
    >
        {text}
    </span>
);

export function ReportManagement() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortField>('createdUtc');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [editModal, setEditModal] = useState<{ isOpen: boolean; report: ModerationReport | null }>({
        isOpen: false,
        report: null,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadReports();
    }, [page, sortBy, sortOrder]);

    const loadReports = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            const result = await getAllReports(page, PAGE_SIZE, sortBy, sortOrder, token ?? undefined);
            setReports(result.items);
            setTotalCount(result.totalCount);
        } catch {
            setError(t('unexpectedErrorLoadingReports'));
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setPage(1);
    };

    const handleSave = async (id: string, data: UpdateReportRequest) => {
        setIsSaving(true);
        try {
            const token = getAuthToken();
            const updated = await updateReport(id, data, token ?? undefined);
            setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
        } catch {
            throw new Error(t('unexpectedErrorUpdatingReport'));
        } finally {
            setIsSaving(false);
        }
    };

    const getPriorityLabel = (priority: string) => {
        const key = `priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`;
        return t(key);
    };

    const getPriorityColor = (priority: string) =>
        PRIORITY_COLORS[priority?.toLowerCase()] || PRIORITY_COLORS.low;

    const getStatusColor = (status: string) =>
        STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.pending;

    const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
        <TableHead>
            <button
                className="flex items-center gap-1 hover:text-foreground"
                onClick={() => handleSort(field)}
            >
                {label}
                {sortBy === field && (
                    <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
            </button>
        </TableHead>
    );

    return (
        <div className="flex">
            <LeftPanel />
            <main className="flex-1 relative min-h-screen overflow-y-auto bg-muted p-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="outline" size="sm"
                            onClick={() => navigate('/moderator')}
                            className="flex items-center gap-2"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                            {t('backToDashboard')}
                        </Button>
                        <h1 className="text-xl font-semibold">{t('reportManagementTitle')}</h1>
                    </div>

                    {isLoading && <p>{t('loadingReports')}</p>}
                    
                    {!isLoading && !error && (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('description')}</TableHead>
                                        <SortHeader field="priority" label={t('priority')} />
                                        <SortHeader field="status" label={t('status')} />
                                        <SortHeader field="createdUtc" label={t('created')} />
                                        <TableHead>{t('action')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                {t('noReports')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        reports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="py-2 max-w-[200px] truncate">
                                                    {report.description ?? t('noDescription')}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Badge
                                                        color={getPriorityColor(report.priority)}
                                                        text={getPriorityLabel(report.priority)}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Badge
                                                        color={getStatusColor(report.status)}
                                                        text={report.status}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    {new Date(report.createdUtc).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEditModal({ isOpen: true, report })}
                                                        className="gap-1"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        {t('edit')}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

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

            <EditReportModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, report: null })}
                report={editModal.report}
                onSave={handleSave}
                isSaving={isSaving}
            />
        </div>
    );
}