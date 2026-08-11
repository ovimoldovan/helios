import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';

import { Homepage } from './features/homepage/components/Homepage';
import { LoginForm } from '@/features/login/components/LoginForm';
import { RegisterForm } from '@/features/registration/components/RegisterForm';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { ModeratorDashboard } from '@/features/moderator/components/ModeratorDashboard';
import { ModeratorRoute } from '@/features/moderator/components/ModeratorRoute';
import { getAuthToken } from '@/shared/auth/getAuthToken';
import { getUserRole } from '@/shared/auth/getUserRole';
import { UserRole } from '@/shared/types/UserRole';

function App() {
    const token = getAuthToken();
    const role = token ? getUserRole(token) : null;

    const isAdmin = role === UserRole.Admin;
    const isModerator = role === UserRole.Moderator;

    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route
                    path="/login"
                    element={
                        <main className="p-8">
                            <LoginForm />
                        </main>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <main className="min-h-screen p-6">
                            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
                                <RegisterForm />
                            </div>
                        </main>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <AdminRoute isAdmin={isAdmin}>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/moderator"
                    element={
                        <ModeratorRoute isModerator={isModerator}>
                            <ModeratorDashboard />
                        </ModeratorRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;