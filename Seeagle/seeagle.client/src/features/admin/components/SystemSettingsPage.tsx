import { useEffect, useState } from 'react';
import {
    getSystemSettings,
    updateSystemSettings,
} from '@/features/admin/api/systemSettingsApi';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const MAX_DISTANCE_METERS = 1000;
const MAX_TIME_WINDOW_HOURS = 365 * 24;

export function SystemSettingsPage() {
    const { t } = useTranslation();

    const [distance, setDistance] = useState('');
    const [timeWindowHours, setTimeWindowHours] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        getSystemSettings()
            .then((settings) => {
                setDistance(String(settings.duplicateDistanceMeters));
                setTimeWindowHours(String(settings.duplicateTimeWindowHours));
            })
            .catch(() => setError(t('errorLoadingSettings', 'Could not load system settings.')))
            .finally(() => setIsLoading(false));
    }, [t]);

    const distanceValue = Number(distance);
    const timeWindowValue = Number(timeWindowHours);

    const distanceError =
        distance === '' || Number.isNaN(distanceValue)
            ? t('fieldRequired', 'This field is required.')
            : distanceValue <= 0 || distanceValue > MAX_DISTANCE_METERS
                ? t('distanceRangeError', `Must be between 0 and ${MAX_DISTANCE_METERS} meters.`)
                : null;

    const timeWindowError =
        timeWindowHours === '' || Number.isNaN(timeWindowValue)
            ? t('fieldRequired', 'This field is required.')
            : timeWindowValue <= 0 || timeWindowValue > MAX_TIME_WINDOW_HOURS
                ? t('timeWindowRangeError', `Must be between 0 and ${MAX_TIME_WINDOW_HOURS} hours (1 year).`)
                : null;

    const isValid = !distanceError && !timeWindowError;

    const handleSave = async () => {
        if (!isValid) return;

        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const updated = await updateSystemSettings({
                duplicateDistanceMeters: distanceValue,
                duplicateTimeWindowHours: timeWindowValue,
            });
            setDistance(String(updated.duplicateDistanceMeters));
            setTimeWindowHours(String(updated.duplicateTimeWindowHours));
            setSuccessMessage(t('settingsSaved', 'Settings saved.'));
        } catch (err) {
            setError(extractErrorMessage(err, t));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-y-auto p-8 bg-muted">
            <Card className="relative z-10 mx-auto max-w-2xl w-full">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {t('systemSettingsTitle', 'System Settings')}
                    </CardTitle>
                    <CardDescription>
                        {t(
                            'systemSettingsDescription',
                            'Tune the thresholds used to detect duplicate reports.'
                        )}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <p>{t('loading', 'Loading...')}</p>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="distance">
                                    {t('duplicateDistanceLabel', 'Duplicate distance (meters)')}
                                </Label>
                                <Input
                                    id="distance"
                                    type="number"
                                    min={0}
                                    max={MAX_DISTANCE_METERS}
                                    step="1"
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                />
                                {distanceError && (
                                    <p className="text-sm text-red-600">{distanceError}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeWindow">
                                    {t('duplicateTimeWindowLabel', 'Duplicate time window (hours)')}
                                </Label>
                                <Input
                                    id="timeWindow"
                                    type="number"
                                    min={0}
                                    max={MAX_TIME_WINDOW_HOURS}
                                    step="1"
                                    value={timeWindowHours}
                                    onChange={(e) => setTimeWindowHours(e.target.value)}
                                />
                                {timeWindowError && (
                                    <p className="text-sm text-red-600">{timeWindowError}</p>
                                )}
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}
                            {successMessage && (
                                <p className="text-sm text-green-600">{successMessage}</p>
                            )}

                            <Button onClick={handleSave} disabled={!isValid || isSaving}>
                                {isSaving ? t('saving', 'Saving...') : t('save', 'Save')}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}

function extractErrorMessage(err: unknown, t: (key: string, fallback?: string) => string): string {
    if (err && typeof err === 'object') {
        const asAny = err as any;
        if (typeof asAny.message === 'string') {
            return asAny.message;
        }
        if (asAny.errors && typeof asAny.errors === 'object') {
            const firstKey = Object.keys(asAny.errors)[0];
            const firstMessage = asAny.errors[firstKey]?.[0];
            if (typeof firstMessage === 'string') {
                return firstMessage;
            }
        }
    }
    return t('errorSavingSettings', 'Could not save settings.');
}