import { useEffect, useState } from 'react';
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
import { getCookie } from '@/shared/utils/cookies';
import { createReportType, disableReportType, getReportTypes, updateReportType } from '@/features/admin/api/adminApi';
import type { ReportType } from '@/shared/types/report';

export function ReportTypesPage() {
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editError, setEditError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadReportTypes() {
            try {
                const reportTypes = await getReportTypes(
                    getCookie('authToken')!
                );

                setReportTypes(reportTypes);
            } catch {
                setError(t('unexpectedErrorLoadingReportTypes'));
            } finally {
                setIsLoading(false);
            }
        }

        loadReportTypes();
    }, [t]);
    
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

            setReportTypes((current) => [...current, created]);

            setSuccess(
                t('reportTypeAddedSuccess', { name: created.name })
            );
            setName('');
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'This report type already exists.'
            ) {
                setError(t('reportTypeAlreadyExists'));
            } else {
                setError(t('unexpectedErrorAddingReportType'));
            }
        }
         finally {
            setIsSubmitting(false);
        }
    }

    function handleStartEdit(reportType: ReportType) {
        setEditingId(reportType.id);
        setEditName(reportType.name);
        setEditError(null);
    }

    async function handleUpdateReportType(id: string) {
        const trimmedName = editName.trim();

        if (!trimmedName) {
            setEditError(t('reportTypeNameRequired'));
            return;
        }

        setIsUpdating(true);
        setEditError(null);

        try {
            const updated = await updateReportType(
                id,
                trimmedName,
                getCookie('authToken')!
            );

            setReportTypes((current) =>
                current.map((reportType) =>
                    reportType.id === id ? updated : reportType
                )
            );

            setEditingId(null);
            setEditName('');
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'This report type already exists.'
            ) {
                setEditError(t('reportTypeAlreadyExists'));
            } else {
                setEditError(t('unexpectedErrorUpdatingReportType'));
            }
        } finally {
            setIsUpdating(false);
        }
    }

    async function handleDisableReportType(id: string) {
        try {
            const disabled = await disableReportType(
                id,
                getCookie('authToken')!
            );

            setReportTypes((current) =>
                current.map((reportType) =>
                    reportType.id === id ? disabled : reportType
                )
            );
        } catch {
            setEditError(t('unexpectedErrorDisablingReportType'));
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

                    <div className="mt-6 space-y-3">
                        {isLoading && (
                            <p className="text-sm text-muted-foreground">
                                {t('loadingReportTypes')}
                            </p>
                        )}
                        {reportTypes.map((reportType) => (
                            <div
                                key={reportType.id}
                                className={`flex items-center gap-2 ${!reportType.isActive ? 'opacity-50' : ''}`}
                            >
                                {editingId === reportType.id ? (
                                    <>
                                        <Input
                                            maxLength={20}
                                            value={editName}
                                            disabled={isUpdating}
                                            onChange={(event) => {
                                                setEditName(event.target.value);
                                                setEditError(null);
                                            }}
                                        />

                                        <Button
                                            onClick={() => handleUpdateReportType(reportType.id)}
                                            disabled={isUpdating || !editName.trim()}
                                        >
                                            {isUpdating ? t('saving') : t('save')}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditName('');
                                                setEditError(null);
                                            }}
                                            disabled={isUpdating}
                                        >
                                            {t('cancel')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                    <span className="flex-1">
                        {reportType.name}
                    </span>

                                        {reportType.isActive && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleStartEdit(reportType)}
                                                >
                                                    {t('edit')}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleDisableReportType(reportType.id)}
                                                >
                                                    {t('disable')}
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}

                        {editError && (
                            <FieldError>
                                {editError}
                            </FieldError>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}