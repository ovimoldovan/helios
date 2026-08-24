import './App.css';

import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/shared/context/AuthContext';
import { UsersListPage } from '@/features/admin/components/UsersListPage';
import { Homepage } from './features/homepage/components/Homepage';
import { LoginForm } from '@/features/login/components/LoginForm';
import { RegisterForm } from '@/features/registration/components/RegisterForm';
import { AdminDashboard } from '@/features/admin/components/AdminDashboard';
import { ModeratorDashboard } from '@/features/moderator/components/ModeratorDashboard';
import {ErrorPage} from "@/shared/error_page/components/ErrorPage.tsx";
import {PrivateRoutes} from "@/shared/utils/PrivateRoutes.tsx";
import {Toaster} from "@/components/ui/toast.tsx";
import { ReportTypesPage } from '@/features/admin/components/ReportTypesPage';
import { ModerationQueue } from '@/features/moderator/components/ModerationQueue';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Homepage />} />

                <Route
                    path="/login"
                    element={
                        <LoginForm/>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <RegisterForm/>
                    }
                />

                <Route element={<PrivateRoutes allowedRoles={['Admin']}/>}>
                    <Route
                        path="/admin"
                        element={
                            <AdminDashboard/>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <UsersListPage />
                        }
                    />

                    <Route
                        path="/admin/report-types"
                        element={
                            <ReportTypesPage />
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