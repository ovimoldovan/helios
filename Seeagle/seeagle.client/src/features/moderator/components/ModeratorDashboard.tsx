import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from "@/components/ui/button.tsx";

export function ModeratorDashboard() {
    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">Moderator Dashboard</CardTitle>
                    <CardDescription>Manage reports that require moderation.</CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2">
                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Moderation Queue</span>
                        <span className="font-normal">Review reports waiting for moderation.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Priority Reports</span>
                        <span className="font-normal">View reports ordered by priority.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Approved Reports</span>
                        <span className="font-normal">View reports that have already been approved.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Report Management</span>
                        <span className="font-normal">Review and edit submitted reports.</span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}