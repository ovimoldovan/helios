import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
<<<<<<< HEAD

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
=======
import {Button} from "@/components/ui/button.tsx";
>>>>>>> main

export function ModeratorDashboard() {
    const navigate = useNavigate();
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

<<<<<<< HEAD
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {moderatorSections.map((section) => (
                        <Card
                            key={section.title}
                            onClick={() => section.path && navigate(section.path)}
                            className={section.path ? 'cursor-pointer' : ''}
                        >
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>
=======
                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">Priority Reports</span>
                        <span className="font-normal">View reports ordered by priority.</span>
                    </Button>
>>>>>>> main

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