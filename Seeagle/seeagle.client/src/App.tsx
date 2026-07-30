import './App.css';

import { Route, Routes } from 'react-router-dom';

import { LoginForm } from '@/features/login/components/LoginForm';
import { Homepage } from './features/homepage/components/Homepage';
import { RegisterForm } from './features/registration/components/RegisterForm';

function App() {
    const isAuthenticated = false;

    return (
        <Routes>
            <Route
                path="/"
                element={<Homepage isAuthenticated={isAuthenticated} />}
            />

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
        </Routes>
    );
}

export default App;