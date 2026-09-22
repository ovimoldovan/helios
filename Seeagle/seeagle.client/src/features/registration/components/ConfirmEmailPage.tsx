import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { confirmEmail } from "@/features/registration/api/registrationApi.ts";

export function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const hasRequestedRef = useRef(false);

    useEffect(() => {
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        const userId = searchParams.get("user");
        const token = searchParams.get("token");

        if (!userId || !token) {
            navigate('/register', {
                state: {
                    title: 'E-Mail confirmation failed',
                    description: 'Invalid E-mail confirmation link',
                },
            });
            return;
        }

        confirmEmail({ userId, token })
            .then(() => {
                navigate('/login');
            })
            .catch(() => {
                navigate('/register', {
                    state: {
                        title: 'E-Mail confirmation failed',
                        description: 'Invalid E-mail confirmation link',
                    },
                });
            });
    }, [searchParams, navigate, t]);

    return null;
}