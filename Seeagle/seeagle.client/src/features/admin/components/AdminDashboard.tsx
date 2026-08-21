import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import './AdminDashboard.css';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold ">{t('adminDashboard')}</CardTitle>
                    <CardDescription>{t('adminDashboardDescription')}</CardDescription>
                </CardHeader>

                <div className="m-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('areas')}</span>
                        <span className="font-normal">{t('defineReviewAreas')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('users')}</span>
                        <span className="font-normal">{t('viewRegisteredUsers')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('permissions')}</span>
                        <span className="font-normal">{t('assignAdministrativePermissions')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('reportTypes')}</span>
                        <span className="font-normal">{t('defineViewEditReportTypes')}</span>
                    </Button>

                    <Button className="admin-dashboard-button">
                        <span className="text-base font-semibold">{t('reports')}</span>
                        <span className="font-normal">{t('reviewSubmittedReports')}</span>
                    </Button>
                </div>
            </Card>
        </main>
    );
}