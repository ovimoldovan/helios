// src/features/admin/components/ReportSummaryCharts.tsx

import { useTranslation } from 'react-i18next';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from '@/components/ui/chart';
import type { ReportSummary } from '../api/adminApi';

interface ReportSummaryChartsProps {
    summary: ReportSummary;
}

export function ReportSummaryCharts({ summary }: ReportSummaryChartsProps) {
    const { t } = useTranslation();

    if (summary.totalCount === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                {t('noSummaryData')}
            </p>
        );
    }

    // ─────────────────────────────────────────────────────────
    // Status - Pie Chart
    // ─────────────────────────────────────────────────────────
    const statusData = summary.byStatus.map((item) => ({
        status: item.status,
        count: item.count,
        fill: getStatusColor(item.status),
    }));

    const statusConfig: ChartConfig = Object.fromEntries(
        summary.byStatus.map((item) => [
            item.status,
            { label: item.status, color: getStatusColor(item.status) },
        ])
    );

    // ─────────────────────────────────────────────────────────
    // Type - Bar Chart
    // ─────────────────────────────────────────────────────────
    const typeData = summary.byType.map((item) => ({
        type: item.type,
        count: item.count,
        fill: '#3b82f6',
    }));

    const typeConfig: ChartConfig = {
        count: { label: t('reportCount'), color: '#3b82f6' },
    };

    // ─────────────────────────────────────────────────────────
    // Area - Bar Chart
    // ─────────────────────────────────────────────────────────
    const areaData = summary.byArea.map((item) => ({
        area: item.areaId === null ? t('noArea') : item.areaName ?? t('noArea'),
        count: item.count,
    }));

    const areaConfig: ChartConfig = {
        count: { label: t('reportCount'), color: '#22c55e' },
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── By Status - Pie Chart ─────────────────────── */}
            <div>
                <h4 className="font-semibold text-sm mb-4 text-center">
                    {t('byStatus')}
                </h4>
                <ChartContainer config={statusConfig} className="h-[250px] w-full">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={statusData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {statusData.map((entry) => (
                                <Cell key={entry.status} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="status" />}
                        />
                    </PieChart>
                </ChartContainer>
            </div>

            {/* ── By Type - Bar Chart ───────────────────────── */}
            <div>
                <h4 className="font-semibold text-sm mb-4 text-center">
                    {t('byType')}
                </h4>
                <ChartContainer config={typeConfig} className="h-[250px] w-full">
                    <BarChart data={typeData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="type"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis tickLine={false} axisLine={false} width={30} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </div>

            {/* ── By Area - Bar Chart ───────────────────────── */}
            <div>
                <h4 className="font-semibold text-sm mb-4 text-center">
                    {t('byArea')}
                </h4>
                <ChartContainer config={areaConfig} className="h-[250px] w-full">
                    <BarChart data={areaData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="area"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis tickLine={false} axisLine={false} width={30} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
}

// Culori pentru status (consistente cu badge-urile existente)
function getStatusColor(status: string): string {
    switch (status) {
        case 'Pending':
            return '#eab308'; // galben
        case 'Approved':
            return '#22c55e'; // verde
        case 'Rejected':
            return '#ef4444'; // roșu
        case 'Solved':
            return '#3b82f6'; // albastru
        default:
            return '#94a3b8'; // gri
    }
}