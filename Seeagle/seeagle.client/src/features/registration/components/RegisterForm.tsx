import { useState } from 'react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { registerUser } from '../api/registrationApi';

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
    const [isSuccess, setIsSuccess] = useState(false);

    function validateForm(): RegisterFormErrors {
        const validationErrors: RegisterFormErrors = {};

        const trimmedEmail = email.trim();
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (trimmedEmail.length === 0) {
            validationErrors.email = 'Email is required.';
        } else if (!emailPattern.test(trimmedEmail)) {
            validationErrors.email = 'Enter a valid email address.';
        }

        if (password.length === 0) {
            validationErrors.password = 'Password is required.';
        } else if (password.length < 8) {
            validationErrors.password =
                'Password must contain at least 8 characters.';
        } else if (!/[A-Z]/.test(password)) {
            validationErrors.password =
                'Password must contain an uppercase letter.';
        } else if (!/[a-z]/.test(password)) {
            validationErrors.password =
                'Password must contain a lowercase letter.';
        }

        if (trimmedFirstName.length === 0) {
            validationErrors.firstName = 'First name is required.';
        } else if (trimmedFirstName.length > maxNameLength) {
            validationErrors.firstName =
                `First name must have at most ${maxNameLength} characters.`;
        }

        if (trimmedLastName.length === 0) {
            validationErrors.lastName = 'Last name is required.';
        } else if (trimmedLastName.length > maxNameLength) {
            validationErrors.lastName =
                `Last name must have at most ${maxNameLength} characters.`;
        }

        return validationErrors;
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const validationErrors = validateForm();

        setErrors(validationErrors);
        setIsSuccess(false);

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

            setIsSuccess(true);
            setErrors({});
        } catch {
            setErrors({
                form: 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
            </CardHeader>

            <CardContent>
                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="register-email">Email*</Label>

                        <Input
                            id="register-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            aria-invalid={Boolean(errors.email)}
                            onChange={(event) => setEmail(event.target.value)}
                        />

                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="register-password">Password*</Label>

                        <Input
                            id="register-password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            aria-invalid={Boolean(errors.password)}
                            onChange={(event) => setPassword(event.target.value)}
                        />

                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="register-first-name">
                            First Name*
                        </Label>

                        <Input
                            id="register-first-name"
                            autoComplete="given-name"
                            value={firstName}
                            maxLength={maxNameLength}
                            aria-invalid={Boolean(errors.firstName)}
                            onChange={(event) => setFirstName(event.target.value)}
                        />

                        {errors.firstName && (
                            <p className="text-sm text-destructive">
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="register-last-name">
                            Last Name*
                        </Label>

                        <Input
                            id="register-last-name"
                            autoComplete="family-name"
                            value={lastName}
                            maxLength={maxNameLength}
                            aria-invalid={Boolean(errors.lastName)}
                            onChange={(event) => setLastName(event.target.value)}
                        />

                        {errors.lastName && (
                            <p className="text-sm text-destructive">
                                {errors.lastName}
                            </p>
                        )}
                    </div>

                    {errors.form && (
                        <p className="text-sm text-destructive">
                            {errors.form}
                        </p>
                    )}

                    {isSuccess && (
                        <p className="text-sm">
                            Account created successfully.
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}