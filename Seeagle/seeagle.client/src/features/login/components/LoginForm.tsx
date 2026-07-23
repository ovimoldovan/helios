import { useState } from 'react';
import type React from 'react';
import { loginUser } from '../api/loginApi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardAction,
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
            await loginUser({email, password});
            alert('Login successful!');
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
                <CardAction>
                    <Button variant="link">Register</Button>
                </CardAction>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email-input"
                                type="text"
                                placeholder="Type in email"
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
                                id="password-input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading} />
                        </div>
                    </div>
                    
                    <CardAction className="flex-col gap-2">
                        <Button type="submit" variant="link">
                            Login
                        </Button>
                    </CardAction>
                    
                    {error && (
                        <p className="text-sm font-medium text-destructive">{error}</p>
                    )}  
                </CardContent>
                
            </form>
        </Card>
    );
}