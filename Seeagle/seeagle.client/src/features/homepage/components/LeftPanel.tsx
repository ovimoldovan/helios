import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    return (
        <>
            {!isOpen && (
                <button
                    className="sm:hidden fixed top-4 left-4 z-9999 w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200 shadow-sm"
                    onClick={() => setIsOpen(true)}
                >
                    ☰
                </button>
            )}

            <div className={`
                fixed z-9998 h-dvh
                bg-white p-4
                flex flex-col 
                transition-all duration-300 ease-in-out
                w-72
                ${isOpen ? 'left-0' : '-left-72'}
                sm:left-0
                overflow-y-auto
                border-r border-gray-100
            `}>
                <div className="flex items-center justify-between mb-6 gap-2">
                    <Logo />
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs px-3 h-7"
                            onClick={() => navigate('/login')}
                        >
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                        <button
                            className="sm:hidden w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 shrink-0"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="mb-4 shrink-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1 tracking-wider">
                        Seeagle
                    </p>
                    <div className="flex items-start gap-2 p-1 rounded-lg">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="font-medium text-gray-800 text-sm">
                                {isPlacingPin ? 'Placing pin...' : 'Placing pin'}
                            </p>
                            <p className="text-[10px] text-gray-400">
                                {isPlacingPin ? 'click map to drop' : 'tap map to drop'}
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200 mb-4 shrink-0" />

                <div className="shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-gray-800 text-sm">Downtown district</p>
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            MP
                        </span>
                    </div>

                    {isAuthenticated ? (
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2 border-2 border-gray-300 rounded-full py-2 h-auto text-gray-700 text-sm font-normal hover:bg-gray-50 hover:border-gray-400 transition-all"
                            onClick={onNewReport}
                        >
                            <span className="text-base leading-none">+</span>
                            New report
                        </Button>
                    ) : (
                        <div className="w-full border-2 border-gray-200 rounded-full py-2 text-center text-sm text-gray-400">
                             Login to add report
                        </div>
                    )}

                    <p className="text-[10px] text-gray-400 mt-3">Line report </p>
                </div>

                {isAuthenticated && (
                    <div className="mt-auto pt-3 border-t border-gray-200 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8 bg-gray-700 text-white">
                                    <AvatarFallback className="text-xs font-medium bg-gray-700 text-white">
                                        LM
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block">
                                    <p className="font-medium text-gray-800 text-xs">Luciana Morar</p>
                                    <p className="text-[10px] text-gray-400">lm@example.com</p>
                                </div>
                            </div>
                            <button
                                className="w-8 h-8 rounded-full hover:bg-gray-100 transition flex items-center justify-center shrink-0"
                            >
                                <img
                                    src="/setting-lines.png"
                                    alt="Settings"
                                    className="w-4 h-4 object-contain"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {isOpen && (
                <div
                    className="sm:hidden fixed inset-0 z-9997 bg-black/30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}