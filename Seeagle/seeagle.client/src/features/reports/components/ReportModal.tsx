import { useState, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createReport, uploadReportPhoto} from '@/features/reports/api/reportApi.ts';
import type { Report } from '@/shared/types/report';
import { useTranslation } from 'react-i18next';
interface AddReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReportCreated: (report: Report) => void;
    pinPosition: [number, number] | null;
}

export function AddReportModal({
    isOpen,
    onClose,
    onReportCreated,
    pinPosition 
}: AddReportModalProps) {
    const [description, setDescription] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

    const handleClose = () => {
        setDescription('');
        setError(null);
        resetPhoto();
        onClose();
    };

    const handleSubmit = async () => {
        if (!pinPosition) {
            setError(t('placePinFirst'));
            return;
        }

        if (description.length > 255) {
            setError(t('descriptionTooLong'));
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const report = await createReport({
                longitude: pinPosition[1], 
                latitude: pinPosition[0],
                description: description.trim() || null,
            });

            if (photoFile) {
                try {
                    await uploadReportPhoto(report.id, photoFile);
                } catch {
                    onReportCreated(report);
                    handleClose();
                    setError(t('reportCreatedPhotoFailed'));
                    setIsSubmitting(false);
                    return;
                }
            }
            onReportCreated(report);
            handleClose();
        } catch {
            setError(t('failedToSubmitReport'));
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const resetPhoto = () => {
        if (photoPreviewUrl) {
            URL.revokeObjectURL(photoPreviewUrl);
        }
        setPhotoFile(null);
        setPhotoPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError(t('photoMustBeImage'));
            return;
        }

        if (file.size > MAX_PHOTO_BYTES) {
            setError(t('photoTooLarge'));
            return;
        }

        setError(null);
        if (photoPreviewUrl) {
            URL.revokeObjectURL(photoPreviewUrl);
        }
        setPhotoFile(file);
        setPhotoPreviewUrl(URL.createObjectURL(file));
    };

    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('newReport')}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>{t('location')}</Label>
                        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600 border border-gray-200">
                            {pinPosition ? (
                                ` ${pinPosition[0].toFixed(4)}° N, ${pinPosition[1].toFixed(4)}° E`
                            ) : (
                                t('tapMapToPlacePin')
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">
                            {t('description')} <span className="text-gray-400 text-xs">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            placeholder={t('descriptionPlaceholder')}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={255}
                            className="min-h-[100px]"
                        />
                        <div className="text-right text-xs text-gray-400">
                            {description.length}/255
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">
                                {t('Photo')} <span className="text-gray-400 text-xs">({t('optional')})</span>
                            </Label>

                            {photoPreviewUrl ? (
                                <div className="relative">
                                    <img
                                        src={photoPreviewUrl}
                                        alt={t('photoPreview')}
                                        className="w-full max-h-48 object-cover rounded-md border border-gray-200"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={resetPhoto}
                                    >
                                        {t('remove')}
                                    </Button>
                                </div>
                            ) : (
                                <input
                                    id="photo"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="text-sm text-gray-600 file:mr-3 file:rounded-md file:border file:border-gray-200 file:bg-gray-50 file:px-3 file:py-1.5 file:text-sm"
                                />
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting || !pinPosition}>
                        {isSubmitting ? t('submitting') : t('submitReport')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
