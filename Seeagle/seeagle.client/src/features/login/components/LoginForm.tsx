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

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {login} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

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

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email) {
            setError('Email is required.');
            return;
        }

        if (!password) {
            setError('Password is required.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await loginUser({email, password});

            if (response.token) {
                login();
                navigate(state?.from ? state.from : '/');
            } else {
                setError('Invalid email or password.');
            }
        } catch (apiError) {
            const details = apiError as { errors?: Record<string, string[]> };
            const firstError =
                details.errors?.Email?.[0] ??
                details.errors?.Password?.[0] ??
                'Invalid email or password.';
            setError(firstError);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>

            <form id="login-form" onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel id="email-label" htmlFor="email">Email</FieldLabel>
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
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel id="password-label" htmlFor="password">Password</FieldLabel>
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
                            </Field>

                            <Field className="flex flex-row gap-4">
                                <Button type="submit" form="login-form" className="min-w-max">
                                    Login
                                </Button>

                                <Button type="button" className="min-w-max">
                                    Register
                                </Button>
                            </Field>
                            
                        </FieldGroup>
                </CardContent>
            </form>

            {error && (
                <p className="text-sm font-medium text-destructive text-center">
                    {error}
                </p>
            )}
        </Card>
    );
}