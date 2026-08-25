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
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2">
                    <Button
                        className="admin-dashboard-button"
                        onClick={() => navigate('/moderator/queue')}
                    >
                        <span className="text-base font-semibold">{t('moderationQueueTitle')}</span>
                        <span className="font-normal">{t('moderationQueueDescription')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('priorityReportsTitle')}</span>
                        <span className="font-normal">{t('priorityReportsDescription')}</span>
                    </Button>

                    <Button className="admin-dashboard-button"
                            onClick={() => navigate('/moderator/approved')}
                    >
                        <span className="text-base font-semibold">{t('approvedReportsTitle')}</span>
                        <span className="font-normal">{t('approvedReportsDescription')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('reportManagementTitle')}</span>
                        <span className="font-normal">{t('reportManagementDescription')}</span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}