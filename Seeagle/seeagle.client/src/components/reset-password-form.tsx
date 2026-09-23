import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription, FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {completePasswordReset, validateResetPasswordToken} from "@/features/reset_password/api/resetPasswordApi.ts";

interface ResetPasswordFormErrors {
    password?: string;
    passwordsMatch?: string;
    form?: string;
}

type TokenStatus = 'validating' | 'valid' | 'invalid';

export function ResetPasswordForm({
                                    className,
                                    ...props
                                }: React.ComponentProps<"div">) {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<TokenStatus>('validating');

    const navigate = useNavigate();
    const { t } = useTranslation();
    const hasValidatedRef = useRef(false);

    useEffect(() => {
        if (hasValidatedRef.current) return;
        hasValidatedRef.current = true;

        if (!token) {
            setTokenStatus('invalid');
            return;
        }

        validateResetPasswordToken(token)
            .then(() => setTokenStatus('valid'))
            .catch(() => setTokenStatus('invalid'));
    }, []);

    function clearFieldErrors(field: keyof ResetPasswordFormErrors): void {
        setErrors(prevState => ({...prevState, [field]: undefined}));
    }

    function validateForm(): ResetPasswordFormErrors {
        const validationErrors: ResetPasswordFormErrors = {};

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (password.length === 0) {
            validationErrors.password = t('passwordRequired');
        } else if (!passwordPattern.test(password)) {
            validationErrors.password = t('invalidPassword');
        }

        if (password !== passwordConfirmation)
            validationErrors.passwordsMatch = t('passwordsDontMatch');

        return validationErrors;
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!token) return;

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            await completePasswordReset({ token, newPassword: password });
            navigate('/login', {
                state: {
                    title: t('passwordResetSuccessToastTitle'),
                    description: t('passwordResetSuccessToastDescription')
                }
            });
        } catch {
            setErrors({ form: t('passwordResetFailed') });
        } finally {
            setIsLoading(false);
        }
    }

    if (tokenStatus === 'validating') {
        return null;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t('setNewPasswordTitle')}</CardTitle>
                    <CardDescription>
                        {tokenStatus === 'invalid' && t('invalidResetLinkDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tokenStatus === 'invalid' ? (
                        <FieldDescription className="text-center">
                            <a className="cursor-pointer" onClick={() => navigate('/forgot-password')}>
                                {t('requestNewResetLink')}
                            </a>
                        </FieldDescription>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field id="password-field">
                                    <Field className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                                        <Field>
                                            <FieldLabel id="password-label" htmlFor="password">{t('newPassword')}</FieldLabel>
                                            <Input id="password"
                                                   name="password"
                                                   aria-labelledby="password-label"
                                                   type="password"
                                                   value={password}
                                                   onChange={
                                                       (e) => {
                                                           setPassword(e.target.value)
                                                           clearFieldErrors('password')
                                                           clearFieldErrors('passwordsMatch')
                                                       }
                                                   }
                                                   disabled={isLoading}
                                                   autoComplete="new-password"
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel id="password-confirmation-label" htmlFor="confirm-password">{t('confirmPassword')}</FieldLabel>
                                            <Input id="confirm-password"
                                                   name="confirm-password"
                                                   aria-labelledby="password-confirmation-label"
                                                   type="password"
                                                   value={passwordConfirmation}
                                                   onChange={
                                                       (e) => {
                                                           setPasswordConfirmation(e.target.value)
                                                           clearFieldErrors('passwordsMatch')
                                                       }
                                                   }
                                                   disabled={isLoading}
                                                   autoComplete="new-password"
                                            />
                                        </Field>
                                    </Field>
                                    <FieldError>{errors.password}</FieldError>
                                    <FieldError>{errors.passwordsMatch}</FieldError>
                                    <FieldError>{errors.form}</FieldError>
                                </Field>
                                <Field>
                                    <Button type="submit" disabled={isLoading}>{t('setNewPasswordButton')}</Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}