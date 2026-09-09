import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {changeReportTypeStatus, getReportTypes} from '@/features/admin/api/adminApi';
import type {ReportType} from '@/shared/types/report';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {PaginationLink} from "@/components/ui/pagination.tsx";
import {ChevronLeftIcon, ChevronRightIcon, CirclePlus, Pencil} from "lucide-react";
import {getCookie} from "@/shared/utils/cookies.ts";
import {AddReportTypeModal} from "./AddReportTypeModal";
import {EditReportTypeModal} from "./EditReportTypeModal";

const PAGE_SIZE = 10;

export function ReportTypesPage() {
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReportType, setEditingReportType] = useState<ReportType | null>(null);
    const {t} = useTranslation();

    function fetchReportTypes(targetPage: number = page, showLoading: boolean = false) {
        if (showLoading) setLoading(true);
        setError(null);

        getReportTypes(targetPage, PAGE_SIZE)
            .then((result) => {
                setReportTypes(result.items);
                setTotalCount(result.totalCount);
            })
            .catch(() => setError(t('unexpectedErrorLoadingReportTypes')))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchReportTypes(page, true);
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    async function handleReportTypeStatusChange(id: string) {
        changeReportTypeStatus(id, getCookie('authToken')!)
            .then(() => {
                fetchReportTypes();
            })
            .catch(() => setError(t('unexpectedErrorChangingReportType')));
    }

    function handleReportTypeCreated() {
        if (page === 1) {
            fetchReportTypes(1);
        } else {
            setPage(1);
        }
    }

    function handleReportTypeUpdated() {
        fetchReportTypes();
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <div className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-4 flex items-center">
                    {t('reportTypesPageTitle')}
                    <Button
                        className="ml-2 w-30"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span>{t('newReportTypeButtonText')}</span>
                        <span className="ml-1">
                            <CirclePlus/>
                        </span>
                    </Button>
                </h1>

                {loading && <p>{t('loadingReportTypes')}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('reportTypeNamePlaceholder')}</TableHead>
                                <TableHead>{t('actionColumn')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportTypes.map((reportType) => (
                                <TableRow key={reportType.id} className="group">
                                    <TableCell className="py-2">
                                        <div className="flex items-center gap-2">
                                            <span>{reportType.name}</span>
                                            <button
                                                type="button"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground cursor-pointer rounded"
                                                onClick={() => setEditingReportType(reportType)}
                                                aria-label={t('edit')}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-2">
                                        <Button
                                            className="w-30"
                                            size="sm"
                                            onClick={() => handleReportTypeStatusChange(reportType.id)}
                                        >
                                            {reportType.isActive ? t('disable') : t('enable')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {!loading && !error && (
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
                            <ChevronLeftIcon/>
                        </PaginationLink>

                        <span className="text-sm">
                            {t('pageOf', {page, totalPages})}
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
                            <ChevronRightIcon/>
                        </PaginationLink>
                    </div>
                )}
            </div>
            <AddReportTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onReportTypeCreated={handleReportTypeCreated}
            />
            <EditReportTypeModal
                isOpen={editingReportType !== null}
                onClose={() => setEditingReportType(null)}
                reportType={editingReportType}
                onReportTypeUpdated={handleReportTypeUpdated}
            />
        </div>
    );
}