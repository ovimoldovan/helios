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
        <main className="relative min-h-screen overflow-hidden p-8">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                    backgroundImage: "url('/map-dark-mode.avif')",
                }}
            />

            <div className="relative z-10 mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage the main administrative areas of the application.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {adminSections.map((section) => (
                        <Card key={section.title}>
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>

                                <CardDescription>
                                    {section.description}
                                </CardDescription>
                            </CardHeader>
                            
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}