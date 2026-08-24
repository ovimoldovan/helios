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
import { useTranslation } from 'react-i18next';

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

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (password.length === 0) {
            validationErrors.password = t('passwordRequired');
        } else if (!passwordPattern.test(password)) {
            validationErrors.password = t('invalidPassword');
        }

        if (password !== passwordConfirmation)
            validationErrors.passwordsMatch = t('passwordsDontMatch')


        const maxNameLength = 30;

        if (trimmedFirstName.length === 0) {
            validationErrors.firstName = t('firstNameRequired');
        } else if (trimmedFirstName.length > maxNameLength) {
            validationErrors.firstName = t('firstNameTooLong', { max: maxNameLength });
        }

        if (trimmedLastName.length === 0) {
            validationErrors.lastName = t('lastNameRequired');
        } else if (trimmedLastName.length > maxNameLength) {
            validationErrors.lastName = t('lastNameTooLong', { max: maxNameLength });
        }

        return validationErrors;
    }
    
    function clearFieldErrors(field: keyof RegisterFormErrors): void {
        setErrors(prevState => {
            return {...prevState, [field]: undefined}
        });
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
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{t('registerTitle')}</CardTitle>
                    <CardDescription>
                        {t('registerDescription')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field id="first-name-field">
                                <FieldLabel id="first-name-label" htmlFor="first-name">{t('firstName') + '*'}</FieldLabel>
                                <Input id="first-name"
                                       name="first-name"
                                       aria-labelledby="first-name-label"
                                       type="text"
                                       placeholder={t('firstName')}
                                       value={firstName}
                                       onChange={
                                           (e) => {
                                               setFirstName(e.target.value);
                                               clearFieldErrors('firstName');
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="given-name"
                                />
                                <FieldError>{errors.firstName}</FieldError>
                            </Field>
                            <Field id="last-name-field">
                                <FieldLabel id="last-name-label" htmlFor="last-name">{t('lastName') + '*'}</FieldLabel>
                                <Input id="last-name"
                                       name="last-name"
                                       aria-labelledby="last-name-label"
                                       type="text"
                                       placeholder={t('lastName')}
                                       value={lastName}
                                       onChange={
                                           (e) => {
                                               setLastName(e.target.value)
                                               clearFieldErrors('lastName')
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="family-name"
                                />
                                <FieldError>{errors.lastName}</FieldError>
                            </Field>
                            <Field id="email-field">
                                <FieldLabel id="email-label" htmlFor="email">{t('email') + '*'}</FieldLabel>
                                <Input id="email"
                                       name="email"
                                       aria-labelledby="email-label"
                                       type="email"
                                       placeholder="m@example.com"
                                       value={email}
                                       onChange={
                                           (e) => {
                                               setEmail(e.target.value)
                                               clearFieldErrors('email')
                                           }
                                       }
                                       disabled={isLoading}
                                       autoComplete="email username"
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
                            <Field id="password-field">
                                <Field className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                                    <Field>
                                        <FieldLabel id="password-label" htmlFor="password">{t('password') + '*'}</FieldLabel>
                                        <Input id="password"
                                               name="password"
                                               aria-labelledby="password-label"
                                               type="password"
                                               value={password}
                                               onChange={
                                                   (e) => {
                                                       setPassword(e.target.value)
                                                       clearFieldErrors('password')
                                                       clearFieldErrors('passwordsMatch')
                                                   }
                                               }
                                               disabled={isLoading}
                                               autoComplete="new-password"
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel id="password-confirmation-label" htmlFor="confirm-password">{t('confirmPassword') + '*'}</FieldLabel>
                                        <Input id="confirm-password"
                                               name="confirm-password"
                                               aria-labelledby="password-confirmation-label"
                                               type="password"
                                               value={passwordConfirmation}
                                               onChange={
                                                   (e) => {
                                                       setPasswordConfirmation(e.target.value)
                                                       clearFieldErrors('passwordsMatch')
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
                                <Button type="submit">{t('register')}</Button>
                                <FieldDescription className="text-center">
                                    {t('alreadyHaveAnAccount')} <a className="cursor-pointer" onClick={() => navigate('/login')}>{t('login')}</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
