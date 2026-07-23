import { useState } from 'react';
import type React from 'react';
import { loginUser } from '../api/loginApi';
import { Button } from '@/components/ui/button';

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
        <section className={"login-module max-w-sm mx-auto p-6 border rounded-lg shadow-sm"}>
            <h1 className={"text-2x; font-bold mb-2"}>Welcome back</h1>
            <p className={"text-sm text-gray-500 mb-6"}>Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit} className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-1"}>
                    <label htmlFor={"email-input"} className={"text-sm font-medium"}>Email</label>
                    <input
                        id={"email-input"}
                        type={"text"}
                        className={"border p-2 rounded-md"}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={"Enter your email"}
                    />
                </div>

                <div className={"flex flex-col gap-1"}>
                    <label htmlFor={"password-input"} className={"text-sm font-medium"}>Password</label>
                    <input
                        id={"password-input"}
                        type={"password"}
                        className={"border p-2 rounded-md"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={"••••••••"}
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type={'submit'} disabled={isLoading} className={'mt-2'}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </section>
    );
}