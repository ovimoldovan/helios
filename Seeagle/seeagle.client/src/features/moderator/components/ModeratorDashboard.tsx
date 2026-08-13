import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const moderatorSections = [
    {
        title: 'Moderation Queue',
        description: 'Review reports waiting for moderation.',
        path: '/moderator/queue',
    },
    {
        title: 'Priority Reports',
        description: 'View reports ordered by priority.',
        path: undefined,
    },
    {
        title: 'Approved Reports',
        description: 'View reports that have already been approved.',
        path: undefined,
    },
    {
        title: 'Report Management',
        description: 'Review and edit submitted reports.',
        path: undefined,
    },
];

export function ModeratorDashboard() {
    const navigate = useNavigate();
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
                    Moderator Dashboard
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage reports that require moderation.
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {moderatorSections.map((section) => (
                        <Card
                            key={section.title}
                            onClick={() => section.path && navigate(section.path)}
                            className={section.path ? 'cursor-pointer' : ''}
                        >
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