import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { UsersListPage } from '@/features/admin/components/UsersListPage';
import { Homepage } from './features/homepage/components/Homepage';
import { LoginPage } from '@/features/login/components/LoginPage.tsx';
import { RegisterPage } from '@/features/registration/components/RegisterPage.tsx';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { AdminAreasPage } from './features/admin/components/AdminAreasPage';
import { ModeratorDashboard } from '@/features/moderator/components/ModeratorDashboard';
import {ErrorPage} from "@/shared/error_page/components/ErrorPage.tsx";
import {PrivateRoutes} from "@/shared/utils/PrivateRoutes.tsx";
import {Toaster} from "@/components/ui/toast.tsx";
import { ModerationQueue } from '@/features/moderator/components/ModerationQueue';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route
                    path="/login"
                    element={
                        <LoginPage/>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <RegisterPage/>
                    }
                />

                <Route element={<PrivateRoutes allowedRoles={['Admin']}/>}>
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard/>
                        }
                    />
                  
                    <Route path="/admin/users" 
                      element={
                      <UsersListPage />
                        } 
                    />

                    <Route path="/admin/areas" element={<AdminAreasPage />} />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={['Moderator', 'Admin']}/>}>
                    <Route
                        path="/moderator"
                        element={
                            <ModeratorDashboard/>
                        }
                    />

                    <Route
                        path="/moderator/queue"
                        element={<ModerationQueue />}
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