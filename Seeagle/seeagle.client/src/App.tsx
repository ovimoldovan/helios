import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';

import { Homepage } from './features/homepage/components/Homepage';
import { LoginForm } from '@/features/login/components/LoginForm';
import { RegisterForm } from '@/features/registration/components/RegisterForm';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { ModeratorDashboard } from '@/features/moderator/components/ModeratorDashboard';
import {ErrorPage} from "@/shared/error_page/components/ErrorPage.tsx";
import {PrivateRoutes} from "@/shared/utils/PrivateRoutes.tsx";
import {Toaster} from "@/components/ui/toast.tsx";

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

                <Route element={<PrivateRoutes allowedRoles={['Admin']}/>}>
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard/>
                        }
                    />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={['Moderator', 'Admin']}/>}>
                    <Route
                        path="/moderator"
                        element={
                            <ModeratorDashboard/>
                        }
                    />
                </Route>

                <Route
                    path="/unauthorized"
                    element={
                        <ErrorPage errorCode={"401"} 
                                   errorTitle={"Access Denied"} 
                                   errorText={"Oops, not allowed here!"}
                        />
                    }
                />
                
                <Route
                    path="*"
                    element={
                        <ErrorPage errorCode={"404"} 
                                   errorTitle={"Not Found"} 
                                   errorText={"Oops, looks like this URL doesn't exist!"}
                        />
                    }
                />
            </Routes>
            <Toaster />
        </AuthProvider>
    );
}

export default App;