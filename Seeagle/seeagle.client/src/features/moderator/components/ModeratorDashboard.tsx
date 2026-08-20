import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from "@/components/ui/button.tsx";
import { useTranslation } from 'react-i18next';

export function ModeratorDashboard() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">{t('moderatorDashboard')}</CardTitle>
                    <CardDescription>{t('moderatorDashboardDescription')}</CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2">
                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('moderationQueue')}</span>
                        <span className="font-normal">{t('reviewReportsWaitingForModeration')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('priorityReports')}</span>
                        <span className="font-normal">{t('viewReportsOrderedByPriority')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('approvedReports')}</span>
                        <span className="font-normal">{t('viewReportsThatHaveAlreadyBeenApproved')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('reportManagement')}</span>
                        <span className="font-normal">{t('reviewAndEditSubmittedReports')}</span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}