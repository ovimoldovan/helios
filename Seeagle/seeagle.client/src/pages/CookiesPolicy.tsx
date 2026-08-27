import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

export function CookiesPolicy() {
    return (
        <main className="container max-w-3xl py-12 px-4 mx-auto">
            
            <div className="space-y-6">
                <div className="bg-background">
                    <Link to="/" className="text-sm text-muted-foreground hover:underline">
                        Back to map
                    </Link>
                </div>
                <Logo></Logo>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Cookies Policy
                    </h1>
                    <p>
                        To make Seeagle work properly, we install small files called cookies on your device.
                    </p>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        What are cookies?
                    </h1>
                    <p>
                        A cookie is a small text file that a website stores on your device when you visit said site.
                    </p>
                    <p>
                        - First party cookies are cookies set by the website and only it can read them. Moreover, a website might use external services, which use third-party cookies
                    </p>
                    <p>
                        - Persistent cookies, which are saved on your computer and are not deleted automatically when you quit your browser.
                    </p>
                    <p>
                        Every time you enter our website, essential cookies for the functionality of the website will be activated automatically.
                    </p>
                    <p>
                        Their purpose is to remember settings and preferences such as language, account login etc. for a period of time.
                    </p>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        How do we use cookies?
                    </h1>
                    <p>
                       We only use essential cookies, necessary for keeping you logged in for a longer period of time and other settings. We do not use any marketing or analytics cookies.
                    </p>
                    <p className="font-extrabold">
                        This is what we use cookies for:
                    </p>
                    <p>
                        -Keeping the site functional
                    </p>
                    <p>
                        -Saving your preferences and settings
                    </p>
                    <p>
                        -Keeping you logged in for a limited, longer period of time
                    </p>
                </div>
            </div>
        </main>
    );
}