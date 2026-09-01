import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthRequiredModal({ isOpen, onClose }: AuthRequiredModalProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleNavigate = (path: string) => {
        onClose();
        navigate(path);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-xl">
                        {t('authRequiredTitle')}
                    </DialogTitle>

                    <DialogDescription>
                        {t('authRequiredDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleNavigate('/register')}
                    >
                        <UserPlus className="h-4 w-4" />
                        {t('register')}
                    </Button>

                    <Button
                        className="flex-1 gap-2"
                        onClick={() => handleNavigate('/login')}
                    >
                        <LogIn className="h-4 w-4" />
                        {t('login')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}