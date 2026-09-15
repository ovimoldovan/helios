// src/features/admin/components/ReportSummaryBlock.tsx

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReportSummary, type ReportSummary } from '../api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportSummaryBlock() {
    const { t } = useTranslation();
    const [summary, setSummary] = useState<ReportSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSummary = async () => {
            try {
                const data = await getReportSummary();
                setSummary(data);
            } catch {
                setError(t('unexpectedErrorLoadingSummary'));
            } finally {
                setIsLoading(false);
            }
        };
        loadSummary();
    }, [t]);

    if (isLoading) return <p className="text-sm text-muted-foreground">{t('loadingSummary')}</p>;
    if (error) return <p className="text-sm text-red-600">{error}</p>;
    if (!summary) return null;

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-lg">
                    {t('reportSummaryTitle')} ({summary.totalCount})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-semibold text-sm mb-2">{t('byStatus')}</h4>
                        <ul className="space-y-1 text-sm">
                            {summary.byStatus.map((item) => (
                                <li key={item.status} className="flex justify-between">
                                    <span>{item.status}</span>
                                    <span className="font-medium">{item.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2">{t('byType')}</h4>
                        <ul className="space-y-1 text-sm">
                            {summary.byType.map((item) => (
                                <li key={item.type} className="flex justify-between">
                                    <span>{item.type}</span>
                                    <span className="font-medium">{item.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-2">{t('byArea')}</h4>
                        <ul className="space-y-1 text-sm">
                            {summary.byArea.map((item) => (
                                <li key={item.areaId ?? 'no-area'} className="flex justify-between">
                                    <span>{item.areaName}</span>
                                    <span className="font-medium">{item.count}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}