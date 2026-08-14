import type React from 'react';
import {useState} from 'react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

import {registerUser} from '../api/registrationApi';
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {useNavigate} from "react-router-dom";

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

        const passwordPattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;

        if (password.length === 0) {
            validationErrors.password = 'Password is required.';
        } else if (!passwordPattern.test(password)) {
            validationErrors.password =
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
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
                form: 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create account</CardTitle>
                </CardHeader>

                <form id="login-form" onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <FieldGroup>
                            <Field className="whitespace-nowrap">
                                <FieldLabel id="email-label" htmlFor="email">Email*</FieldLabel>
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
                                <FieldLabel id="password-label" htmlFor="password">Password*</FieldLabel>
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
                                <FieldLabel id="first-name-label" htmlFor="first-name">First Name*</FieldLabel>
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
                                <FieldLabel id="last-name-label" htmlFor="last-name">Last Name*</FieldLabel>
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
                                    Register
                                </Button>
                            </Field>

                        </FieldGroup>
                    </CardContent>
                </form>
                
            </Card>
        </main>
    );
}