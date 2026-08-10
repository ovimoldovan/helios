import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { UsersListPage } from '@/features/admin/components/UsersListPage';
import { Homepage } from './features/homepage/components/Homepage';
import { LoginForm } from '@/features/login/components/LoginForm';
import { RegisterForm } from '@/features/registration/components/RegisterForm';

function App() {
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

                <Route path="/admin/users" element={<UsersListPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;