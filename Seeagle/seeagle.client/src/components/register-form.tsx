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
import React, {useState} from "react";
import {registerUser} from "@/features/registration/api/registrationApi.ts";
import {useNavigate} from "react-router-dom";

interface RegisterFormErrors {
    email?: string;
    password?: string;
    passwordsMatch?: string;
    firstName?: string;
    lastName?: string;
    form?: string;
}

export function RegisterForm({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
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

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (password.length === 0) {
            validationErrors.password = 'Password is required.';
        } else if (!passwordPattern.test(password)) {
            validationErrors.password =
                'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.';
        }

        if (password !== passwordConfirmation)
            validationErrors.passwordsMatch = 'Passwords must match.'


        const maxNameLength = 30;

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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} method="post" action="#">
                        <FieldGroup>
                            <Field id="first-name-field">
                                <FieldLabel id="first-name-label" htmlFor="first-name">First Name</FieldLabel>
                                <Input id="first-name"
                                       name="first-name"
                                       aria-labelledby="first-name-label"
                                       type="text"
                                       placeholder="First Name"
                                       value={firstName}
                                       onChange={
                                           (e) => {
                                               setFirstName(e.target.value);
                                               errors.firstName = undefined;
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="given-name"
                                />
                                <FieldError>{errors.firstName}</FieldError>
                            </Field>
                            <Field id="last-name-field">
                                <FieldLabel id="last-name-label" htmlFor="last-name">Last Name</FieldLabel>
                                <Input id="last-name"
                                       name="last-name"
                                       aria-labelledby="last-name-label"
                                       type="text"
                                       placeholder="Last Name"
                                       value={lastName}
                                       onChange={
                                           (e) => {
                                               setLastName(e.target.value)
                                               errors.lastName = undefined;
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="family-name"
                                />
                                <FieldError>{errors.lastName}</FieldError>
                            </Field>
                            <Field id="email-field">
                                <FieldLabel id="email-label" htmlFor="email">Email</FieldLabel>
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
                                       autoComplete="email username"
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
                            <Field id="password-field">
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel id="password-label" htmlFor="password">Password</FieldLabel>
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
                                               autoComplete="new-password"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel id="password-confirmation-label" htmlFor="confirm-password">Confirm Password</FieldLabel>
                                        <Input id="confirm-password"
                                               name="confirm-password"
                                               aria-labelledby="password-confirmation-label"
                                               type="password"
                                               value={passwordConfirmation}
                                               onChange={
                                                   (e) => {
                                                       setPasswordConfirmation(e.target.value)
                                                       errors.passwordsMatch = undefined;
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
                                <Button type="submit">Register</Button>
                                <FieldDescription className="text-center">
                                    Already have an account? <a href="/login">Sign in</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
