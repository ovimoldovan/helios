import type React from 'react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

import {registerUser} from '../api/registrationApi';
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';

const maxNameLength = 30;

interface RegisterFormErrors {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    form?: string;
}

export function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { t } = useTranslation();

    function validateForm(): RegisterFormErrors {
        const validationErrors: RegisterFormErrors = {};

        const trimmedEmail = email.trim();
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (trimmedEmail.length === 0) {
            validationErrors.email = t('emailRequired');
        } else if (!emailPattern.test(trimmedEmail)) {
            validationErrors.email = t('invalidEmail');
        }

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

        if (password.length === 0) {
            validationErrors.password = t('passwordRequired');
        } else if (!passwordPattern.test(password)) {
            validationErrors.password = t('invalidPassword');
        }

        if (trimmedFirstName.length === 0) {
            validationErrors.firstName = t('firstNameRequired');
        } else if (trimmedFirstName.length > maxNameLength) {
            validationErrors.firstName =
                t('firstNameTooLong', { max: maxNameLength });
        }

        if (trimmedLastName.length === 0) {
            validationErrors.lastName = t('lastNameRequired');
        } else if (trimmedLastName.length > maxNameLength) {
            validationErrors.lastName =
                t('lastNameTooLong', { max: maxNameLength });
        }

        return validationErrors;
    }

    async function handleSubmit(
        event: React.SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setIsLoading(true);

            await registerUser({
                email: email.trim(),
                password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });

            setErrors({});
            navigate('/login');
        } catch {
            setErrors({
                form: t('registrationFailed'),
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{t('createAccount')}</CardTitle>
                </CardHeader>

                <form id="login-form" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <FieldGroup>
                            <Field className="whitespace-nowrap">
                                <FieldLabel id="email-label" htmlFor="email">{t('emailField')}</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    aria-labelledby="email-label"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />

                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email}
                                    </p>
                                )}
                            </Field>
                            
                            <Field className="whitespace-nowrap">
                                <FieldLabel id="password-label" htmlFor="password">{t('passwordField')}</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    aria-labelledby="password-label"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />

                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </Field>
                            
                            <Field className="whitespace-nowrap">
                                <FieldLabel id="first-name-label" htmlFor="first-name">{t('firstNameField')}</FieldLabel>
                                <Input
                                    id="first-name"
                                    type="text"
                                    aria-labelledby="first-name-label"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    disabled={isLoading}
                                />

                                {errors.firstName && (
                                    <p className="text-sm text-destructive">
                                        {errors.firstName}
                                    </p>
                                )}
                            </Field>
                            
                            <Field className="whitespace-nowrap">
                                <FieldLabel id="last-name-label" htmlFor="last-name">{t('lastNameField')}</FieldLabel>
                                <Input
                                    id="last-name"
                                    type="text"
                                    aria-labelledby="last-name-label"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isLoading}
                                />

                                {errors.lastName && (
                                    <p className="text-sm text-destructive">
                                        {errors.lastName}
                                    </p>
                                )}
                            </Field>

                            <Field className="flex flex-row gap-4">
                                <Button type="submit" form="login-form" className="min-w-max">
                                    {t('createAccount')}
                                </Button>
                            </Field>

                        </FieldGroup>
                    </CardContent>
                </form>
                
            </Card>
        </main>
    );
}