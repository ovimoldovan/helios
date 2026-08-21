import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={() => i18n.changeLanguage('en')}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                {t('languageEn')}
            </button>
            <button
                onClick={() => i18n.changeLanguage('ro')}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                {t('languageRo')}
            </button>
        </div>
    );
}