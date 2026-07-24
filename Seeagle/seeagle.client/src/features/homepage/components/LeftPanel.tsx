import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LeftPanelProps {
    isAuthenticated?: boolean;
}


export function LeftPanel({ isAuthenticated = false }: LeftPanelProps) {
    const [isOpen, setIsOpen] = useState(true); 

    return (
        <>
            {/*  Buton vizibil doar când panoul e ÎNCHIS, doar pe mobil */}
            {!isOpen && (
                <button
                    className="sm:hidden fixed top-4 left-4 z-9999 w-10 h-10 rounded-full bg-white flex items-center justify-center  border-gray-200"
                    onClick={() => setIsOpen(true)}
                >
                    ☰
                </button>
            )}

            {/*  Panoul lateral */}
            <div className={`
                fixed z-9998 h-dvh
                bg-white p-4
                flex flex-col 
                transition-all duration-300 ease-in-out
                w-72
                ${isOpen ? 'left-0' : '-left-72'}
                sm:left-0
                overflow-y-auto
            `}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 gap-2">
                    <Logo />
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="rounded-full text-xs px-3">
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                        {/* Buton X */}
                        <button
                            className="sm:hidden w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 shrink-0"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Seeagle - Placing pin */}
                <div className="mb-4 shrink-0">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">
                        Seeagle
                    </p>
                    <div className="flex items-start gap-2">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="font-medium text-gray-800 text-sm">Placing pin</p>
                            <p className="text-[10px] text-gray-400">tap map to drop</p>
                        </div>
                    </div>
                </div>

                {/* Linie separatoare */}
                <hr className="border-gray-200 mb-4 shrink-0" />

                {/* Downtown district */}
                <div className="shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-800 text-sm">Downtown district</p>
                    </div>
                    <button className="w-full border-2 border-gray-300 rounded-full py-2 text-gray-700 text-sm hover:bg-green-900/50 transition">
                        <span className="text-base mr-1">+</span>
                        New raport
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">Line report</p>
                </div>

                {/* User info */}
                {isAuthenticated && (
                    <div className="mt-auto pt-3 border-t border-gray-200 shrink-0">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center font-bold text-xs">
                                    JD
                                </div>
                                <div className="hidden sm:block">
                                    <p className="font-medium text-gray-800 text-xs">Luciana Morar</p>
                                    <p className="text-[10px] text-gray-400">luciana@example.com</p>
                                </div>
                            </div>

                            {/*  Buton Settings */}
                            <button
                                className="w-16 h-16 sm:w-13 sm:h-13 rounded-full hover:bg-gray-100 transition flex items-center justify-center shrink-0"
                                onClick={() => console.log('Settings clicked')}
                            >
                                <img
                                    src="/setting-lines.png"
                                    alt="Settings"
                                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                                />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/*  Overlay pentru mobil */}
            {isOpen && (
                <div
                    className="sm:hidden fixed inset-0 z-9997 bg-black/30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}