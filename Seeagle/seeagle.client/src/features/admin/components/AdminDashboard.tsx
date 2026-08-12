import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const adminSections = [
    {
        title: 'Areas',
        description: 'Define and review application areas.',
    },
    {
        title: 'Users',
        description: 'View the list of registered users.',
    },
    {
        title: 'Permissions',
        description: 'Assign administrative permissions to users.',
    },
    {
        title: 'Report Types',
        description: 'Define, view and edit report types.',
    },
    {
        title: 'Reports',
        description: 'Review reports submitted by users.',
    },
];

export function AdminDashboard() {
    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted dark">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">Admin Dashboard</CardTitle>
                    <CardDescription>Manage the main administrative areas of the application.</CardDescription>
                </CardHeader>


                <div className="m-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {adminSections.map((section) => (
                        <Card key={section.title} className="h-full">
                            <CardHeader className="flex-1">
                                <CardTitle>{section.title}</CardTitle>

                                <CardDescription>
                                    {section.description}
                                </CardDescription>
                            </CardHeader>

                        </Card>
                    ))}
                </div>
            </Card>
        </main>
    );
}