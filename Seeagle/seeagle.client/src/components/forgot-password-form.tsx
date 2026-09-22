import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { resetPassword } from "@/features/reset_password/api/resetPasswordApi.ts";

interface ResetPasswordFormErrors {
    email?: string;
}

export function ForgotPasswordForm({
                                      className,
                                      ...props
                                  }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    function validateForm(): ResetPasswordFormErrors {
        const validationErrors: ResetPasswordFormErrors = {};

        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0)
            validationErrors.email = t('emailRequired');

        return validationErrors;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(email.trim());
            setIsSent(true);
        } catch {
            setErrors({ email: t('resetFailed') });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t('resetPasswordTitle')}</CardTitle>
                    <CardDescription>
                        {isSent
                            ? t('resetPasswordSentDescription')
                            : t('resetPasswordDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSent ? (
                        <FieldGroup>
                            <Field>
                                <Button type="button" onClick={() => navigate('/login')}>
                                    {t('backToLogin')}
                                </Button>
                            </Field>
                        </FieldGroup>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field id="email-field">
                                    <FieldLabel id="email-label" htmlFor="email">
                                        {t('email')}
                                    </FieldLabel>
                                    <Input id="email"
                                           name="email"
                                           aria-labelledby="email-label"
                                           type="email"
                                           placeholder="m@example.com"
                                           value={email}
                                           onChange={(e) => {
                                               setEmail(e.target.value);
                                               setErrors(prev => ({ ...prev, email: undefined }));
                                           }}
                                           disabled={isLoading}
                                           autoComplete="email"
                                    />
                                    <FieldError>{errors.email}</FieldError>
                                </Field>
                                <Field>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? t('sending') : t('reset')}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}