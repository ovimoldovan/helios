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
import { ErrorPage } from "@/shared/error_page/components/ErrorPage.tsx";
import { PrivateRoutes } from "@/shared/utils/PrivateRoutes.tsx";
import { Toaster } from "@/components/ui/toast.tsx";
import { CookiesPolicy } from "@/pages/CookiesPolicy.tsx";
import { ReportTypesPage } from '@/features/admin/components/ReportTypesPage';
import { ModerationQueue } from '@/features/moderator/components/ModerationQueue';
import {ApprovedReports} from "@/features/moderator/components/ApprovedReports.tsx";
import { MyReports } from '@/features/reports/components/MyReports';
import {ReportManagement} from "@/features/moderator/components/ReportManagemnt.tsx";

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
                <Route
                    path="/my-reports"
                    element={
                            <MyReports />
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
                    <Route
                        path="/moderator/approved"
                        element={<ApprovedReports />}
                    />
                    <Route path="/moderator/reports" element={<ReportManagement />} />
                    
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
                
                <Route
                    path="/cookies"
                    element={
                        <CookiesPolicy/>
                    }
                />
            </Routes>
            <Toaster />
        </AuthProvider>
    );
}

export default App;