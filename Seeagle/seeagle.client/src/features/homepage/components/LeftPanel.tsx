import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { getUserFromToken } from '@/shared/utils/getUserFromToken.ts';
import { Menu, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { ReactNode } from 'react';
import { UserRole } from '@/shared/types/UserRole'
interface LeftPanelProps {
    sidebarExtra?: ReactNode;
    onCancelPlacePin?: () => void;
    isPlacingPin?: boolean;
}

export function LeftPanel({ sidebarExtra, onCancelPlacePin, isPlacingPin}: LeftPanelProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const { isAuthenticated, logout } = useAuth();
    const user = getUserFromToken();

    const getInitials = () => {
        if (!user) return '?';
        const firstName = user.given_name || '';
        const lastName = user.family_name || '';
        return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?';
    };

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
            navigate('/');
        } else {
            navigate('/login');
        }
        setIsOpen(false);
    };

    const isAdmin = user?.role === UserRole.Admin;
    const isModerator = user?.role === UserRole.Moderator || isAdmin;

    return (
        <>
            <div className="sm:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background border-b border-border flex items-center justify-between px-4">
                <Logo />
                <button
                    className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <Card className={`
                fixed sm:relative z-50 h-full w-72 rounded-none border-r shadow-none
                ${isOpen ? 'left-0' : '-left-72'}
                sm:left-0
                transition-all duration-300
                flex flex-col
            `}>
                <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
                    <Logo />
                    <button
                        className="sm:hidden w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                        onClick={() => setIsOpen(false)}
                    >
                        ✕
                    </button>
                </CardHeader>

                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between">
                        <LanguageSwitcher />
                        {isPlacingPin ? (
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAuthAction}
                                    className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                                    disabled
                                >
                                    <Plus className="h-4 w-4"/>
                                    <span>{t('placing')}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                                    onClick={onCancelPlacePin}
                                >
                                    <X className="h-4 w-4"/>
                                    <span className="truncate">{t('cancel')}</span>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-xs px-3 h-7"
                                onClick={handleAuthAction}
                            >
                                {isAuthenticated ? t('logout') : t('login')}
                            </Button>
                        )}
                    </div>

                    <nav className="space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            {t('home')}
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('admin')}
                            </Link>
                        )}

                        {isModerator && (
                            <Link
                                to="/moderator"
                                className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsOpen(false)}
                            >
                                {t('moderator')}
                            </Link>
                        )}
                    </nav>

                    {sidebarExtra}

                    {isAuthenticated && user && (
                        <div className="mt-auto pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs font-medium">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block">
                                    <p className="font-medium text-xs">
                                        {user.given_name} {user.family_name}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <div className="p-4 pt-2 border-t border-border">
                    <Link
                        to="/cookies"
                        className="text-[10px] text-muted-foreground hover:underline"
                    >
                        Cookies Policy
                    </Link>
                </div>
            </Card>

            {isOpen && (
                <div
                    className="sm:hidden fixed inset-0 z-40 bg-black/30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}