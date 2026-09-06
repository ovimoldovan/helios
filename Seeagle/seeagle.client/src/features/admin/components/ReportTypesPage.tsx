import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {changeReportTypeStatus, getReportTypes} from '@/features/admin/api/adminApi';
import type {ReportType} from '@/shared/types/report';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {PaginationLink} from "@/components/ui/pagination.tsx";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {getCookie} from "@/shared/utils/cookies.ts";

const PAGE_SIZE = 10;

export function ReportTypesPage() {
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        getReportTypes(page, PAGE_SIZE)
            .then((result) => {
                setReportTypes(result.items)
                setTotalCount(result.totalCount)
            })
            .catch(() => setError(t('unexpectedErrorLoadingReportTypes')))
            .finally(() => setLoading(false));
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    
    async function handleReportTypeStatusChange(id : string) {
        changeReportTypeStatus(id, getCookie('authToken')!)
            .then((updatedReportType) => {
                setReportTypes((prevState) => 
                prevState.map((reportType) => (reportType.id === updatedReportType.id ? updatedReportType : reportType))
                );
            })
            .catch(() => setError(t('unexpectedErrorChangingReportType')))
    }

    return (
        <main className="flex">
            <div className="flex-1 p-6">
                <h1 className="text-xl font-semibold mb-4">{t('reportTypesPageTitle')}</h1>

                {loading && <p>{t('loadingUsers')}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('reportTypeNamePlaceholder')}</TableHead>
                                    <TableHead>{t('actionColumn')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reportTypes.map((reportType) => (
                                    <TableRow key={reportType.id}>
                                        <TableCell className="py-2">{reportType.name}</TableCell>
                                        <TableCell className="py-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleReportTypeStatusChange(reportType.id)}
                                            >
                                                { reportType.isActive ? t('disable') : t('enable') }
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
              {t('pageOf', { page, totalPages })}
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