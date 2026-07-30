import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Homepage } from './features/homepage/components/Homepage';
import { RegisterForm } from './features/registration/components/RegisterForm';

function App() {
    const isAuthenticated = true; //  true/false

    return (
        <Routes>
            <Route
                path="/"
                element={<Homepage isAuthenticated={isAuthenticated} />}
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
