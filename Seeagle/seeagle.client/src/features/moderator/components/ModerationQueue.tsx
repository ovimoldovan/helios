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
export function ModerationQueue() {
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        async function loadReports() {
            const token = getAuthToken();
            const result = await getPendingReports(token ?? undefined);

            setReports(result);
            setIsLoading(false);
        }

        loadReports();
    }, []);

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
                )}
            </div>
        </main>
    );
}