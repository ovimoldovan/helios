import './App.css';
import { Homepage } from './features/homepage/components/Homepage';

function App() {
    const isAuthenticated = true; //  true/false

    return <Homepage isAuthenticated={isAuthenticated} />;
}

export default App;
