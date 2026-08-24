import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createReportType } from '@/features/admin/api/adminApi';
import { getCookie } from '@/shared/utils/cookies';

export function ReportTypesPage() {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleAddReportType() {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Report type name is required.');
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

            setSuccess(`Report type "${created.name}" added successfully.`);
            setName('');
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'DUPLICATE_REPORT_TYPE'
            ) {
                setError('This report type already exists.');
            } else {
                setError('Unexpected error while adding report type.');
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
                        Report Types
                    </CardTitle>

                    <CardDescription>
                        Add report types that users can select when creating reports.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Report type name"
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
                                    void handleAddReportType();
                                }
                            }}
                        />

                        <Button
                            onClick={() => void handleAddReportType()}
                            disabled={isSubmitting || !name.trim()}
                        >
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </Button>
                    </div>

                    {error && (
                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="mt-2 text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                        Maximum 20 characters.
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}