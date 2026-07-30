import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm } from "@/features/login/components/LoginForm";
import { Homepage } from './features/homepage/components/Homepage';

function App() {
    const isAuthenticated = false;

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Homepage isAuthenticated={isAuthenticated} />} />
                <Route path='/login' element={
                    <main className={'p-8'}>
                        <LoginForm />
                    </main>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;