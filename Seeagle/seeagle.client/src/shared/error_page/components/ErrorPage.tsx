import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';

interface ErrorPageProps {
    errorCode: string;
    errorTitle: string;
    errorText: string;
    buttonText?: string;
    buttonRedirect?: string;
}

export function ErrorPage({errorCode, errorTitle, errorText, buttonText = '', buttonRedirect = ''}: ErrorPageProps) {
    const navigate = useNavigate();

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-card p-6 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
                <span className="text-[25vw] text-secondary sm:text-[22vw]">
                    {errorCode}
                </span>
            </div>

            <div className="relative z-10 flex max-w-md flex-col items-center space-y-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                        {errorTitle}
                    </h1>
                    <div className="text-foreground sm:text-lg">
                        {errorText}
                    </div>
                </div>

                {buttonText !== '' && buttonRedirect !== '' &&
                    <Button className="bg-primary" onClick={() => navigate(buttonRedirect)}>
                        {buttonText}
                    </Button>
                }
            </div>
        </div>
    );
}