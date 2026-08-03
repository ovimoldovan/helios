import { useState } from 'react';
import type React from 'react';
import { loginUser } from '../api/loginApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
                alert('Login successful!');
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
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
            </form>

            <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-center gap-4">
                    <Button type="submit" form="login-form" variant="link">
                        Login
                    </Button>
                    <Button variant="link">
                        Register
                    </Button>
                </div>

                {error && (
                    <p className="text-sm font-medium text-destructive text-center">
                        {error}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}