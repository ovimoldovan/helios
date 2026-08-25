import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field';
import { createReportType } from '@/features/admin/api/adminApi';
import { getCookie } from '@/shared/utils/cookies';

export function ReportTypesPage() {
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleAddReportType() {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError(t('reportTypeNameRequired'));
            setSuccess(null);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const created = await createReportType(
                trimmedName,
                getCookie('authToken')!
            );

            setSuccess(
                t('reportTypeAddedSuccess', { name: created.name })
            );
            setName('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(t('unexpectedErrorAddingReportType'));
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-4xl w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {t('reportTypesPageTitle')}
                    </CardTitle>

                    <CardDescription>
                        {t('reportTypesPageDescription')}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder={t('reportTypeNamePlaceholder')}
                            maxLength={20}
                            value={name}
                            disabled={isSubmitting}
                            onChange={(event) => {
                                setName(event.target.value);
                                setError(null);
                                setSuccess(null);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleAddReportType();
                                }
                            }}
                        />

                        <Button
                            onClick={handleAddReportType}
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? t('adding') : t('add')}
                        </Button>
                    </div>

                    {error && (
                        <FieldError className="mt-2">
                            {error}
                        </FieldError>
                    )}

                    {success && (
                        <p className="mt-2 text-sm text-primary">
                            {success}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                        {t('maximum20Characters')}
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}