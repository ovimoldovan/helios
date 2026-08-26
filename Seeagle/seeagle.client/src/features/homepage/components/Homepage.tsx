import {useEffect, useState} from 'react';
import { Map } from './Map';
import { LeftPanel } from '@/features/homepage/components/LeftPanel';
import { AddReportModal } from '@/features/reports/components/ReportModal.tsx';
import type { Report } from '@/shared/types/report';
import { MapSidebarExtra } from '../MapSidebarExtra';
import {getApprovedReports} from "@/features/reports/api/reportApi.ts";

export function Homepage() {
    const [isPlacingPin, setIsPlacingPin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pinPosition, setPinPosition] = useState<[number, number] | null>(null);
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const loadApprovedReports = async () => {
            const data = await getApprovedReports(30);
            setReports(data);
        };
        loadApprovedReports();
        }, []);
    
    const handlePinPlaced = (position: [number, number] | null) => {
        setPinPosition(position);
        if (position) {
            setIsPlacingPin(false);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <LeftPanel
                sidebarExtra = {
                    <MapSidebarExtra
                    onNewReport={() => setIsPlacingPin(true)}
                    isPlacingPin={isPlacingPin}
                    setPinPosition(null);
                }}
            />

            <div className="absolute inset-0 z-0 isolate">
                <Map
                    onPinPlaced={handlePinPlaced}
                    reports={reports}
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
        </div>
    );
}