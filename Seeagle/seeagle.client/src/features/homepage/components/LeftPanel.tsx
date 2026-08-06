import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';


interface LeftPanelProps {
    isAuthenticated?: boolean;
    onNewReport?: () => void;
    isPlacingPin?: boolean;
}

export function LeftPanel({
                              isAuthenticated = false,
                              onNewReport,
                              isPlacingPin = false
                          }: LeftPanelProps) {

    const [isOpen, setIsOpen] = useState(true);
    
    const { isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();

    return (
        <>
            {!isOpen && (
                <button
                    className="sm:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-background border border-border shadow-lg text-2xl"
                    onClick={() => setIsOpen(true)}
                >
                    ☰
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs px-3 h-7"
                            onClick={() => navigate('/login')}
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                        <button
                            className="sm:hidden w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Seeagle
                        </p>
                        <div className="flex items-start gap-2">
                            <span className="text-xl">📍</span>
                            <div>
                                <p className="font-medium text-sm">
                                    {isPlacingPin ? 'Placing pin...' : 'Placing pin'}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    {isPlacingPin ? 'click map to drop' : 'tap map to drop'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-border" />
                  
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">Downtown district</p>
                            <Badge variant="secondary" className="text-[10px]">
                                MP
                            </Badge>
                        </div>

                        {isAuthenticated ? (
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2 border-2 rounded-full py-2 h-auto text-sm font-normal"
                                onClick={onNewReport}
                            >
                                <span className="text-base">+</span>
                                New report
                            </Button>
                        ) : (
                            <div className="w-full border-2 border-border rounded-full py-2 text-center text-sm text-muted-foreground">
                                 Login to add report
                            </div>
                        )}

                        <p className="text-[10px] text-muted-foreground">Line report </p>
                    </div>
                    <button className="w-full border-2 border-gray-300 rounded-full py-2 text-gray-700 text-sm hover:bg-green-900/50 transition">
                        <span className="text-base mr-1">+</span>
                        New report
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">Line report</p>
                </div>

                {isAuthenticated && (
                    <div className="mt-auto pt-3 border-t border-gray-200 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center font-bold text-xs">
                                    JD
                                </div>
                                <div className="hidden sm:block">
                                    <p className="font-medium text-gray-800 text-xs"></p>
                                    <p className="text-[10px] text-gray-400"></p>
                                </div>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                                    <img
                                        src="/setting-lines.png"
                                        alt="Settings"
                                        className="w-4 h-4 object-contain"
                                    />
                                </Button>
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