import './App.css';
import { LoginForm } from "@/features/login/components/LoginForm";
import { Homepage } from './features/homepage/components/Homepage';

function App() {
    const isAuthenticated = false;

    if (isAuthenticated) {
        return <Homepage isAuthenticated={isAuthenticated} />;
    } else {
        return (
            <main className="p-8">
                <LoginForm />
            </main>
        );
    }
}

export default App;