import { useEffect, useState } from 'react';
import { Map } from './Map';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';
import { AddReportModal } from '@/features/reports/components/ReportModal.tsx';
import { AuthRequiredModal } from '@/features/reports/components/AuthRequiredModal';
import type { Report } from '@/shared/types/report';
import { MapSidebarExtra } from '../MapSidebarExtra';
import { getApprovedReports, getMyReports } from "@/features/reports/api/reportApi.ts";
import { useAuth } from '@/shared/context/AuthContext';

export function Homepage() {
    const { isAuthenticated } = useAuth();
    const [isPlacingPin, setIsPlacingPin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [myPendingReports, setMyPendingReports] = useState<Report[]>([]);

    useEffect(() => {
        const loadApprovedReports = async () => {
            const data = await getApprovedReports(30);
            setReports(data);
        };
        loadApprovedReports();
        const loadMyPendingReports = async () => {
            const result = await getMyReports(1, 1000);
            setMyPendingReports(result.items.filter(report => report.status === 'Pending'));
        };
        loadMyPendingReports();
        
    }, []);

    const allReports = [...reports, ...myPendingReports];

    const handlePinPlaced = (position: [number, number] | null) => {
        setPinPosition(position);
        if (position) {
            setIsPlacingPin(false);
            if (!isAuthenticated) {
                setIsAuthModalOpen(true);
                setPinPosition(null);
                return;
            }

            setIsModalOpen(true);
        }
    };

    const handleNewReportClick = () => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        setIsPlacingPin(true);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <LeftPanel
                sidebarExtra={
                    <MapSidebarExtra
                        onNewReport={handleNewReportClick}
                        isPlacingPin={isPlacingPin}
                    />
                }
            />

            <div className="absolute inset-0 z-0 isolate">
                <Map
                    onPinPlaced={handlePinPlaced}
                    reports={allReports}
                    isPlacingPin={isPlacingPin}
                    pinPosition={pinPosition}
                />
            </div>

            <AddReportModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPinPosition(null);
                }}
                onReportCreated={(report) => {
                    setReports([report, ...reports]);
                }}
                pinPosition={pinPosition}
            />

            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setPinPosition(null);
                }}
            />
        </div>
    );
}