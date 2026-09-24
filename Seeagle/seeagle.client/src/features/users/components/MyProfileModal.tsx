import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useTranslation } from 'react-i18next';
import { updateProfile, changePassword } from '@/features/users/api/userApi';
import { useAuth } from '@/shared/context/AuthContext';

interface MyProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        email: string;
        firstName: string;
        lastName: string;
    };
}

export function MyProfileModal({ isOpen, onClose, user }: MyProfileModalProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    async function redirectToReLogin(title: string) {
        await logout();
        onClose();
        navigate('/login', {
            state: {
                title,
                description: t('profileUpdatedRelogin'),
            },
        });
    }

    async function handleProfileSubmit(e: React.FormEvent) {
        e.preventDefault();
        const confirmed = window.confirm(t('confirmProfileChangeMessage'));
        if (!confirmed) return;

        setProfileError(null);
        setIsSavingProfile(true);

        try {
            await updateProfile({ email, firstName, lastName });
            await redirectToReLogin(t('profileUpdatedTitle'));
        } catch {
            setProfileError(t('profileUpdateError'));
            setIsSavingProfile(false);
        }
    }

    async function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        const confirmed = window.confirm(t('confirmPasswordChangeMessage'));
        if (!confirmed) return;

        setPasswordError(null);
        setIsSavingPassword(true);

        try {
            await changePassword({ oldPassword, newPassword });
            await redirectToReLogin(t('passwordChangedTitle'));
        } catch {
            setPasswordError(t('passwordChangeError'));
            setIsSavingPassword(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('myProfile')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <section>
                        <h3 className="text-sm font-semibold mb-3">{t('updateInfo')}</h3>
                        <form onSubmit={handleProfileSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="profile-email">{t('email')}</FieldLabel>
                                    <Input
                                        id="profile-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={true}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="profile-firstname">{t('firstNameField')}</FieldLabel>
                                    <Input
                                        id="profile-firstname"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={isSavingProfile}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="profile-lastname">{t('lastNameField')}</FieldLabel>
                                    <Input
                                        id="profile-lastname"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={isSavingProfile}
                                    />
                                </Field>

                                {profileError && (
                                    <p className="text-sm text-destructive">{profileError}</p>
                                )}

                                <Button type="submit" disabled={isSavingProfile}>
                                    {isSavingProfile ? t('saving') : t('saveChanges')}
                                </Button>
                            </FieldGroup>
                        </form>
                    </section>

                    <hr className="border-border" />

                    <section>
                        <h3 className="text-sm font-semibold mb-3">{t('changePassword')}</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="old-password">{t('currentPassword')}</FieldLabel>
                                    <Input
                                        id="old-password"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        disabled={isSavingPassword}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="new-password">{t('newPassword')}</FieldLabel>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isSavingPassword}
                                    />
                                </Field>

                                {passwordError && (
                                    <p className="text-sm text-destructive">{passwordError}</p>
                                )}

                                <Button type="submit" disabled={isSavingPassword}>
                                    {isSavingPassword ? t('saving') : t('changePassword')}
                                </Button>
                            </FieldGroup>
                        </form>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
}
