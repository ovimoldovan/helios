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
import React, {useEffect, useState} from "react";
import {useAuth} from "@/shared/context/AuthContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/toast.tsx";
import {loginUser} from "@/features/login/api/loginApi.ts";
import { useTranslation } from 'react-i18next';

interface LoginFormErrors {
    email?: string;
    password?: string;
}

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t('loginTitle')}</CardTitle>
                    <CardDescription>
                        {t('loginDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field id="email-field">
                                <FieldLabel id="email-label" htmlFor="email">{t('email')}</FieldLabel>
                                <Input id="email"
                                       name="email"
                                       aria-labelledby="email-label"
                                       type="email"
                                       placeholder="m@example.com"
                                       value={email}
                                       onChange={
                                           (e) => {
                                               setEmail(e.target.value)
                                               errors.email = undefined;
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="email"
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
                            <Field>
                                <FieldLabel id="password-label" htmlFor="password">{t('password')}</FieldLabel>
                                <Input id="password"
                                       name="password"
                                       aria-labelledby="password-label"
                                       type="password"
                                       value={password}
                                       onChange={
                                           (e) => {
                                               setPassword(e.target.value)
                                               errors.password = undefined;
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="current-password"
                                />
                                <FieldError>{errors.password}</FieldError>
                            </Field>
                            <Field>
                                <Button type="submit">{t('login')}</Button>
                                <FieldDescription className="text-center">
                                    {t('missingAccount')} <a className="cursor-pointer" onClick={() => navigate('/register')}>{t('register')}</a>
                                </FieldDescription>
                                {!loginSuccessful &&
                                    <FieldError>{t('incorrectCredentials')}</FieldError>}
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
