import type React from 'react';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {loginUser} from '../api/loginApi';
import {useAuth} from '@/shared/context/AuthContext';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field";
import {toast} from "@/components/ui/toast.tsx";
import { useTranslation } from 'react-i18next';

interface LoginFormErrors {
    email?: string;
    password?: string;
}

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [loginSuccessful, setLoginSuccessful] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const state = location.state as {
        from?: string;
        title?: string;
        description?: string;
    } | null;

    useEffect(() => {
        if (state?.title && state?.description) {
            toast.add({
                id: 'auth-required',
                title: state.title,
                description: state.description,
                type: "error"
            });
        }
    }, [state]);

    function validateForm(): LoginFormErrors {
        const validationErrors: LoginFormErrors = {};

        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0)
            validationErrors.email = t('emailRequired');

        if (password.length === 0)
            validationErrors.password = t('passwordRequired');

        return validationErrors;
    }
    
    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await loginUser({email, password});

            if (response.token) {
                login();
                navigate(state?.from ? state.from : '/');
            } else {
                setLoginSuccessful(false);
            }
        } catch (apiError) {
            setLoginSuccessful(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{t('loginTitle')}</CardTitle>
                    <CardDescription>
                        {t('loginDescription')}
                    </CardDescription>
                </CardHeader>

                <form id="login-form" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel id="email-label" htmlFor="email">{t('email')}</FieldLabel>
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
                                    <p className="text-sm text-destructive whitespace-nowrap">
                                        {errors.email}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel id="password-label" htmlFor="password">{t('password')}</FieldLabel>
                                </div>
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
                                    <p className="text-sm text-destructive whitespace-nowrap">
                                        {errors.password}
                                    </p>
                                )}
                            </Field>

                            <Field className="flex flex-row gap-4">
                                <Button type="submit" form="login-form" className="min-w-max">
                                    {t('login')}
                                </Button>

                                <Button type="button" className="min-w-max" onClick={() => navigate('/register')}>
                                    {t('register')}
                                </Button>
                            </Field>

                        </FieldGroup>
                    </CardContent>
                </form>

                {!loginSuccessful &&(
                    <p className="text-sm font-medium text-destructive text-center">
                        {t('incorrectCredentials')}
                    </p>
                )}
            </Card>
        </main>
    );
}