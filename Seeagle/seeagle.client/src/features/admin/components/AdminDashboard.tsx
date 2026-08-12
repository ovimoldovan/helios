import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function AdminDashboard() {
    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted dark">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">Admin Dashboard</CardTitle>
                    <CardDescription>Manage the main administrative areas of the application.</CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="h-full">
                        <CardHeader className="flex-1">
                            <CardTitle>Areas</CardTitle>
                            <CardDescription>
                                Define and review application areas.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex-1">
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                View the list of registered users.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex-1">
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>
                                Assign administrative permissions to users.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex-1">
                            <CardTitle>Report Types</CardTitle>
                            <CardDescription>
                                Define, view and edit report types.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex-1">
                            <CardTitle>Reports</CardTitle>
                            <CardDescription>
                                Review reports submitted by users.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </Card>
        </main>
    );
}