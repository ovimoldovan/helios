import { useEffect, useState } from 'react';
import { getAuthToken } from '@/shared/auth/getAuthToken';
import { getPendingReports, type ModerationReport } from '@/features/moderator/api/moderationApi';
import { approveReport, rejectReport } from '@/features/moderator/api/moderationApi';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const PAGE_SIZE = 10;

export function ModerationQueue() {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadReports() {
            setIsLoading(true);

            const token = getAuthToken();
            const result = await getPendingReports(
                page,
                PAGE_SIZE,
                token ?? undefined
            );

            setReports(result.items);
            setTotalCount(result.totalCount);
            setIsLoading(false);
        }

        void loadReports();
    }, [page]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    async function handleApprove(id: string) {
        const token = getAuthToken();

        await approveReport(id, token ?? undefined);

        setReports((currentReports) =>
            currentReports.filter((report) => report.id !== id)
        );
    }

    async function handleReject(id: string) {
        const token = getAuthToken();

        await rejectReport(id, token ?? undefined);

        setReports((currentReports) =>
            currentReports.filter((report) => report.id !== id)
        );
    }
    
    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold">
                    Moderation Queue
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Review pending reports and approve or reject them.
                </p>

                {isLoading ? (
                    <p className="mt-6 text-muted-foreground">
                        Loading reports...
                    </p>
                ) : reports.length === 0 ? (
                    <p className="mt-6 text-muted-foreground">
                        No pending reports.
                    </p>
                ) : (
                    <>
                        <div className="mt-6 space-y-4">
                            {reports.map((report) => (
                                <Card key={report.id} className="bg-background/90 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            {report.description ?? 'No description'}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            Status: {report.status}
                                        </p>

                                        <div className="mt-4 flex gap-2">
                                            <Button onClick={() => void handleApprove(report.id)}>
                                                Approve
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={() => void handleReject(report.id)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </Button>

                            <span>
                Page {page} of {totalPages}
            </span>

                            <Button
                                variant="outline"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}