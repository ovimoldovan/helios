import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import './AdminDashboard.css';

export function AdminDashboard() {
    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">Admin Dashboard</CardTitle>
                    <CardDescription>Manage the main administrative areas of the application.</CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Areas</span>
                        <span className="font-normal">Define and review application areas.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Users</span>
                        <span className="font-normal">View the list of registered users.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Permissions</span>
                        <span className="font-normal">Assign administrative permissions to users.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Report Types</span>
                        <span className="font-normal">Define, view and edit report types.</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Reports</span>
                        <span className="font-normal">Review reports submitted by users.</span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}