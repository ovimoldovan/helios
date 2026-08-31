import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function CookiesPolicy() {
    const { t } = useTranslation();
    return (
        <main className="container max-w-3xl py-12 px-4 mx-auto">
            
            <div className="space-y-6">
                <div className="bg-background">
                    <Link to="/" className="text-sm text-muted-foreground hover:underline">
                        {t('backToMap')}
                    </Link>
                </div>
                <Logo></Logo>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('cookiesPolicyTitle')}
                    </h1>
                    <p>
                        
                    </p>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('whatAreCookies')}
                    </h1>
                    <p>
                        {t('cookieDefinition')}
                    </p>
                    <p>
                        - {t('firstPartyCookies')}
                    </p>
                    <p>
                        - {t('persistentCookies')}
                    </p>
                    <p>
                        {t('essentialCookiesNote')}
                    </p>
                    <p>
                        {t('cookiesPurpose')}
                    </p>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t('howWeUseCookies')}
                    </h1>
                    <p>
                       {t('cookiesUsageIntro')}
                    </p>
                    <p className="font-extrabold">
                        {t('cookiesUsageListTitle')}
                    </p>
                    <p>
                        - {t('cookiesUsageItem1')}
                    </p>
                    <p>
                        - {t('cookiesUsageItem2')}
                    </p>
                    <p>
                        - {t('cookiesUsageItem3')}
                    </p>
                </div>
            </div>
        </main>
    );
}