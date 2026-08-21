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
            validationErrors.email = 'Email is required.';

        if (password.length === 0)
            validationErrors.password = 'Password is required.';

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
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your credentials
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
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
                                       autoComplete="email"
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
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
                                       autoComplete="current-password"
                                />
                                <FieldError>{errors.password}</FieldError>
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                                <FieldDescription className="text-center">
                                    Don't have an account? <a href="/register">Sign up</a>
                                </FieldDescription>
                                {!loginSuccessful &&
                                    <FieldError>Invalid E-Mail or Password</FieldError>}
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
