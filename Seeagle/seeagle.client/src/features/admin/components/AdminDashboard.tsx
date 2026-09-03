import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { useTranslation } from 'react-i18next';

export function AdminDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
                <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
                    <Card className="relative z-10 mx-auto max-w-6xl overflow-visible w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold ">{t('adminDashboardTitle')}</CardTitle>
                        <CardDescription>{t('adminDashboardDescription')}</CardDescription>
                    </CardHeader>

                    <div className="m-8 grid gap-6 md:grid-cols-2 auto-rows-fr">
                        <Button className="admin-dashboard-button h-full" disabled>
                            <span className="text-base font-semibold">{t('areasTitle')}</span>
                            <span className="font-normal">{t('areasDescription')}</span>
                        </Button>

                        <Button className="admin-dashboard-button h-full" 
                                onClick={() => navigate('/admin/users')}>
                            <span className="text-base font-semibold">{t('usersTitle')}</span>
                          <span className="font-normal">{t('usersDescription')}</span>
                        </Button>
                        

                        <Button className="admin-dashboard-button h-full"
                        onClick={() => navigate('/admin/report-types')}>
                            <span className="text-base font-semibold">{t('reportTypesTitle')}</span>
                            <span className="font-normal">{t('reportTypesDescription')}</span>
                        </Button>

                        <Button className="admin-dashboard-button h-full" disabled>
                            <span className="text-base font-semibold">{t('reportsTitle')}</span>
                            <span className="font-normal">{t('reportsDescription')}</span>
                        </Button>
                    </div>
                </Card>
            </main>
    );
}