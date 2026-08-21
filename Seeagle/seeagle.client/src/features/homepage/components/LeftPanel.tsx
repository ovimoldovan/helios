import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { getUserFromToken } from '@/shared/utils/getUserFromToken.ts';
import { Menu, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface LeftPanelProps {
    onNewReport?: () => void;
    isPlacingPin?: boolean;
    onCancelPlacePin?: () => void;
}

export function LeftPanel({ onNewReport, isPlacingPin = false, onCancelPlacePin }: LeftPanelProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

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
    };

    return (
        <>
            {!isOpen && (
                <button
                    className="sm:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-full bg-background border border-border shadow-lg flex items-center justify-center"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            <Card className={`
                fixed sm:relative z-40 h-full w-72 rounded-none border-r shadow-none
                ${isOpen ? 'left-0' : '-left-72'}
                sm:left-0
                transition-all duration-300
                flex flex-col
            `}>
                <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
                    <Logo />
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs px-3 h-7"
                            onClick={handleAuthAction}
                        >
                            {isAuthenticated ? t('logout') : t('login')}
                        </Button>
                        <button
                            className="sm:hidden w-7 h-7 rounded-full bg-muted flex items-center justify-center"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <hr className="border-border" />

                    <div className="space-y-3">
                        {isAuthenticated ? (
                            isPlacingPin ? (
                                <div className="grid grid-cols-2">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-ou"
                                        disabled
                                    >
                                        <Plus className="h-4 w-4"/>
                                        <span >{t('placing')}</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-center gap-0.75 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-ou"
                                        onClick={onCancelPlacePin}
                                    >
                                        <X className="h-4 w-4"/>
                                        <span className="truncate">{t('cancel')}</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 border-2 rounded-full py-2 h-auto text-sm font-normal animate-in fade-in slide-in-from-top-2 duration-300 ease-in-out"
                                    onClick={onNewReport}
                                >
                                    <Plus className="h-4 w-4"/>
                                    {t('newReport')}
                                </Button>
                            )
                        ) : (
                            <div className="w-full border-2 border-border rounded-full py-2 text-center text-sm text-muted-foreground">
                                {t('loginToAddReport')}
                            </div>
                        )}
                    </div>

                    {isAuthenticated && user && (
                        <div className="mt-auto pt-3 border-t border-border">
                            <div className="flex items-center justify-between">
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
                        </div>
                    )}
                </CardContent>
            </Card>

            {isOpen && (
                <div
                    className="sm:hidden fixed inset-0 z-30 bg-black/30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}