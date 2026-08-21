import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function ModeratorDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <main className="relative min-h-screen overflow-y-auto bg-muted p-8">
            <Card className="relative z-10 mx-auto w-full max-w-6xl overflow-visible">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">{t('moderatorDashboard')}</CardTitle>
                    <CardDescription>{t('moderatorDashboardDescription')}</CardDescription>
                    </CardTitle>

                    <CardDescription>
                        Manage reports that require moderation.
                    </CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2">
                    <Button
                        <span className="text-base font-semibold">{t('moderationQueue')}</span>
                        <span className="font-normal">{t('reviewReportsWaitingForModeration')}</span>
                        className="admin-dashboard-button"
                        onClick={() => navigate('/moderator/queue')}
                    >
                        <span className="text-base font-semibold">
                            Moderation Queue
                        </span>

                        <span className="font-normal">
                            Review reports waiting for moderation.
                        </span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('priorityReports')}</span>
                        <span className="font-normal">{t('viewReportsOrderedByPriority')}</span>
                        </span>

                        <span className="font-normal">
                            View reports ordered by priority.
                        </span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('approvedReports')}</span>
                        <span className="font-normal">{t('viewReportsThatHaveAlreadyBeenApproved')}</span>
                        </span>

                        <span className="font-normal">
                            View reports that have already been approved.
                        </span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('reportManagement')}</span>
                        <span className="font-normal">{t('reviewAndEditSubmittedReports')}</span>
                        </span>

                        <span className="font-normal">
                            Review and edit submitted reports.
                        </span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}